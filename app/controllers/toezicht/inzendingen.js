import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import ENV from 'frontend-toezicht-abb/config/environment';

export default Controller.extend({
  router: service(),
  page: 0,
  size: 20,
  sort: '-sent-date',
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('toezicht.inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.inzendingen.index';
  }),

  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
  },

  filterChanged: observer('bestuurseenheidId', 'classificatieId', 'provincieId', 'besluitTypeId',
                          'sessionDateFrom', 'sessionDateTo', 'sentDateFrom', 'sentDateTo', 'statusId', function() {
    this.set('page', 0);
  }),

  actions: {
    resetFilters() {
      ['bestuurseenheidId',
       'classificatieId',
       'provincieId',
       'besluitTypeId',
       'sessionDateFrom',
       'sessionDateTo',
       'sentDateFrom',
       'sentDateTo',
       'statusId'].forEach(filter => this.set(filter, null));
    }
  }
});
