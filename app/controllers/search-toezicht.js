import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';

export default Controller.extend({
  router: service(),
  store: service(),
  currentSession: service(),
  besluitType: null,
  besluitTypeUri: null,
  besluitTypeId: null,

  searchType: null,

  queryParams: ["searchString","searchType"],
  searchString: "",

  page: 0,
  size: 10,

  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('search-toezicht')
      && this.get('router.currentRouteName') != 'search-toezicht.index';
  }),

  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.besluitTypes = A();
  },

  actions: {
    selectBesluitType(type) {
      this.set('searchType', type && type.id);
    }
  }
});
