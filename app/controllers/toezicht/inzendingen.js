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
  besluitTypes: [],
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
  
  filterChanged: observer('bestuurseenheidIds', 'classificatieIds', 'provincieIds',
                          'besluitTypeIds', 'regulationTypeId', 'sessionDateFrom', 'sessionDateTo',
                          'sentDateFrom', 'sentDateTo', 'statusUri', function() {
    this.set('page', 0);
  }),

  aRegulationIsSelected: computed('besluitTypes', function() {
    return this.besluitTypes.some(type => type.isRegulation == true);
  }),

  actions: {
    setToTreatStatus(event) {
      this.set('statusUri', null);
      if(event.target.checked) {
        this.set('statusUri', this._toTreatStatusUri);
      }
    },

    resetFilters() {
      ['bestuurseenheidIds',
       'classificatieIds',
       'provincieIds',
       'besluitTypeIds',
       'regulationTypeId',
       'sessionDateFrom',
       'sessionDateTo',
       'sentDateFrom',
       'sentDateTo',
       'statusUri'].forEach(filter => this.set(filter, null));
    },

    selectBesluitTypes(types) {
      this.set('besluitTypes', types);
      this.set('besluitTypeIds', types && types.map(d => d.id));
      this.set('regulationTypeId', null);
    }
  }
});
