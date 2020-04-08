import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ToezichtMeldingenController extends Controller {
  @service router
  @service currentSession

  page = 0;
  size = 20;
  sort = '-sent-date';

  get hasActiveChildRoute() {
    return this.router.currentRouteName.startsWith('toezicht.meldingen')
      && this.router.currentRouteName != 'toezicht.meldingen.index';
  }

  @action
  updateQueryParams(filter) {
    if (filter) {
      filter.keys.forEach(key => this.set(key, filter[key]));
    }
  }
}
