import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SupervisionSubmissionsShowController extends Controller {
  @service currentSession;
  @service router;

  @action
  onCloseComponent() {
    this.router.transitionTo('supervision.submissions.index');
  }
}
