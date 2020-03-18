import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';

export default class SearchToezichtController extends Controller {
  @service router;
  @service store;
  @service currentSession;

  searchType = null;
  queryParams = ["searchString","searchType"];
  searchString = "";
  page = 0;
  size = 10;

  @computed('router.currentRouteName')
  get hasActiveChildRoute() {
    return this.get('router.currentRouteName').startsWith('search-toezicht')
      && this.get('router.currentRouteName') != 'search-toezicht.index';
  }

  constructor() {
    super(...arguments);
    this.header = ENV['vo-webuniversum']['header'];
  }

  @action
  selectBesluitType(type) {
    this.set('searchType', type && type.id);
  }

  @action
  updateBesluitType(types) {
    this.searchType = types;
  }
}
