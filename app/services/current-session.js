import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { waitForProperty } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class CurrentSessionService extends Service {
  @service('session') session;
  @service('store') store;

  @tracked _account;
  @tracked _user;
  @tracked _group;

  // this is a promise
  get account() {
    return this.makePropertyPromise.perform('_account');
  }

  // this contains a promise
  get user() {
    return this.makePropertyPromise.perform('_user');
  }

  // this contains a promise
  get group() {
    return this.makePropertyPromise.perform('_group');
  }

  async load() {
    if (this.session.isAuthenticated) {
      const session = this.session;
      const account = await this.store.find('account', get(session, 'data.authenticated.relationships.account.data.id'));
      const user = await account.gebruiker;
      const group = await this.store.find('bestuurseenheid', get(session, 'data.authenticated.relationships.group.data.id'));
      const roles = await get(session, 'data.authenticated.data.attributes.roles');
      this._account = account;
      this._user = user;
      this._roles = roles;
      this._group = group;

      // The naming is off, but account,user,roles are taken for the
      // promises in a currently public API.
      this.setProperties({
        accountContent: account,
        userContent: user,
        rolesContent: roles,
        groupContent: group
      });

      this.canReadVlabel = this.canAccess('ABBDatabankToezicht-DatabankToezichtVLABEL');
      this.canRead = this.canAccess('ABBDatabankToezicht-DatabankToezichtLezer') || this.canAccess('ABBDatabankToezicht-DatabankToezichtEditeur');
      this.canWrite = this.canAccess('ABBDatabankToezicht-DatabankToezichtEditeur');
    }
  }

  canAccess(role) {
    return this._roles.includes(role);
  }

  // constructs a task which resolves in the promise
  @task
  *makePropertyPromise (property) {
    yield waitForProperty(this, property);
    return this.get(property);
  }
}
