import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';

export default Controller.extend({
  router: service(),
  store: service(),
  currentSession: service(),
  page: 0,
  size: 20,
  besluitTypes: null,
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
    this.besluitTypes = A();
  },

  regulationTypeIsSelected: computed('besluitTypes.[]', 'besluitTypeIds', function() {
    return this.besluitTypeIds ? this.besluitTypes.filterBy('isRegulation', true).length > 0 : false;
  }),

  actions: {
    setToTreatStatus(event) {
      this.set('statusUri', null);
      if(event.target.checked) {
        this.set('statusUri', this._toTreatStatusUri);
      }
    },

    resetFilters() {
      //--- reset the filters
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
      this.set('besluitTypeIds', types && types.map(d => d.get('id')));
      //--- Clear the regulationId property if none of the selected besluitTypes (if any) is a regulation.
      if (!this.besluitTypes.some(type => type.get('isRegulation')))
        this.set('regulationTypeId', null);
    }
  }
});
