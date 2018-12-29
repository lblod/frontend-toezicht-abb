import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'frontend-inzendingen-databank/config/environment';

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

  actions: {
    resetFilters() {
      ['bestuurseenheidId',
       'classificatieId',
       'provincieId',
       'besluitTypeId',
       'sessionDateFrom',
       'sessionDateTo',
       'sentDateFrom',
       'sentDateTo'].forEach(filter => this.set(filter, null));
    }
  }
});
