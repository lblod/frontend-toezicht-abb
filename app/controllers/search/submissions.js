import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

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
}
