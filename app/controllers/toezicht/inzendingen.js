import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { bool } from '@ember/object/computed';
import ENV from 'frontend-toezicht-abb/config/environment';

export default Controller.extend({
  router: service(),
  store: service(),
  page: 0,
  size: 20,
  sort: '-sent-date',
  _toTreatStatusUri: "http://data.lblod.info/melding-statuses/te-behandelen",
  isStatusFilterEnabled: bool('statusUri'),

  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('toezicht.inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.inzendingen.index';
  }),

  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
  },

  filterChanged: observer('bestuurseenheidId', 'classificatieId', 'provincieId',
                          'besluitTypeId', 'regulationTypeId', 'sessionDateFrom', 'sessionDateTo',
                          'sentDateFrom', 'sentDateTo', 'statusUri', function() {
    this.set('page', 0);
  }),

  actions: {
    setToTreatStatus(event) {
      this.set('statusUri', null);
      if(event.target.checked) {
        this.set('statusUri', this._toTreatStatusUri);
      }
    },

    resetFilters() {
      ['bestuurseenheidId',
       'classificatieId',
       'provincieId',
       'besluitTypeId',
       'regulationTypeId',
       'sessionDateFrom',
       'sessionDateTo',
       'sentDateFrom',
       'sentDateTo',
       'statusUri'].forEach(filter => this.set(filter, null));
    },

    selectBesluitType(type) {
      this.set('besluitType', type);
      this.set('besluitTypeId', type && type.id);
      this.set('regulationTypeId', null);
    }
  }
});
