import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';

@classic
export default class SearchToezichtController extends Controller {
  @service
  router;

  @service
  store;

  @service
  currentSession;

  besluitType = null;
  besluitTypeUri = null;
  besluitTypeId = null;
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

  init() {
    super.init(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.besluitTypes = A();
  }

  @action
  selectBesluitType(type) {
    this.set('searchType', type && type.id);
  }
}
