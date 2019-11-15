import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import moment from 'moment';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';

export default Controller.extend({
  router: service(),
  store: service(),
  page: 0,
  size: 20,
  besluitTypes: null,
  sort: '-sent-date',
  lastMonth: moment().subtract(1, 'month').startOf('day'),
  nextYear: moment().add(1, 'year').startOf('day'),

  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('toezicht.vlabel-inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.vlabel-inzendingen.index';
  }),

  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.besluitTypes = A();
  },

  actions: {
    resetFilters() {
      //--- reset the filters
      ['bestuurseenheidIds',
       'marCodeIds',
       'sessionDateFrom',
       'sessionDateTo',
       'sentDateFrom',
       'sentDateTo',
       'dateOfEntryIntoForceFrom',
       'dateOfEntryIntoForceTo',
       'endDateFrom',
       'endDateTo'].forEach(filter => this.set(filter, null));
    }
  }
});
