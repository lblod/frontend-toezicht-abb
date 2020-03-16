import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

@classic
export default class CurrentSessionService extends Service {
  @service('session')
  session;

  @service('store')
  store;

  async load() {
    if (this.get('session.isAuthenticated')) {
      const session = this.session;
      const account = await this.store.find('account', get(session, 'data.authenticated.relationships.account.data.id'));
      const user = await account.get('gebruiker');
      const group = await this.store.find('bestuurseenheid', get(session, 'data.authenticated.relationships.group.data.id'));
      const roles = await get(session, 'data.authenticated.data.attributes.roles');
      this.set('_account', account);
      this.set('_user', user);
      this.set('_roles', roles);
      this.set('_group', group);

      // The naming is off, but account,user,roles are taken for the
      // promises in a currently public API.
      this.setProperties({
        accountContent: account,
        userContent: user,
        rolesContent: roles,
        groupContent: group
      });

      this.set('canReadVlabel', this.canAccess('ABBDatabankToezicht-DatabankToezichtVLABEL'));
      this.set('canRead', this.canAccess('ABBDatabankToezicht-DatabankToezichtLezer') || this.canAccess('ABBDatabankToezicht-DatabankToezichtEditeur'));
      this.set('canWrite', this.canAccess('ABBDatabankToezicht-DatabankToezichtEditeur'));
    }
  }

  canAccess(role) {
    return this._roles.includes(role);
  }

  // constructs a task which resolves in the promise
  @task(function * (property) {
    yield waitForProperty(this, property);
    return this.get(property);
  })
  makePropertyPromise;

  // this is a promise
  @computed('_account')
  get account() {
    return this.makePropertyPromise.perform('_account');
  }

  // this contains a promise
  @computed('_user')
  get user() {
    return this.makePropertyPromise.perform('_user');
  }

  // this contains a promise
  @computed('_group')
  get group() {
    return this.makePropertyPromise.perform('_group');
  }
}
