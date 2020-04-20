import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchSubmissionsController extends Controller {
  @service router

  searchString = "";
  page = 0;
  size = 10;

  get hasActiveChildRoute() {
    return this.router.currentRouteName.startsWith('search.submissions')
      && this.router.currentRouteName != 'search.submissions.index';
  }

  @action
  selectBesluitType(type) {
    this.set('searchType', type && type.map(t => t.id));
  }
}
