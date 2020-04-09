import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ToezichtInzendingenController extends Controller {
  @service router
  @service currentSession

  page = 0;
  size = 20;
  sort = '-sent-date';

  get hasActiveChildRoute() {
    return this.router.currentRouteName.startsWith('toezicht.inzendingen')
      && this.router.currentRouteName != 'toezicht.inzendingen.index';
  }

  @action
  updateQueryParams(filter) {
    if (filter) {
      filter.keys.forEach(key => this.set(key, filter[key]));
    }
  }
}
