import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SearchSubmissionsShowController extends Controller {
  @service currentSession;
  @service router;

  @action
  onCloseComponent() {
    this.router.transitionTo('search.submissions.index');
  }
}
