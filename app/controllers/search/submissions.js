import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';

export default class SearchSubmissionsController extends Controller {
  @service router;

  page = 0;
  size = 20;

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith('search.submissions') &&
      this.router.currentRouteName !== 'search.submissions.index'
    );
  }

  @action
  setFilter(key, value) {
    if (typeOf(value) === 'array') {
      this.filter[key] = value.join(',');
    } else {
      this.filter[key] = value;
    }
    this.updateQueryParams();
  }

  @action
  updateQueryParams() {
    this.filter.keys.forEach((key) => this.set(key, this.filter[key]));
  }
}
