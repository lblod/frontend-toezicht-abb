import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { includes } from 'ember-awesome-macros/array';
import { raw } from 'ember-awesome-macros';

export default Service.extend({
  session: service('session'),
  ajax: service(),

  init() {
    this._super(...arguments);
    this.set('permissions', A());
  },

  async load() {
    if (this.get('session.isAuthenticated')) {
      const accountId = this.session.data.authenticated.relationships.account.data.id;

      const response = await this.ajax.request(`/permissions?filter[accounts][id]=${accountId}`);
      const permissions = response.data.map(permission => permission.attributes.uri);

      this.set('permissions', A(permissions));
    }
  },

  canRead: includes('permissions', raw('http://data.lblod.info/id/account-permissions/read')),
  canWrite: includes('permissions', raw('http://data.lblod.info/id/account-permissions/write'))
});
