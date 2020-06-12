import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import {action} from '@ember/object';

export default class SupervisionSubmissionsShowController extends Controller {
  @service currentSession;

  @action
  onCloseComponent(){
    this.transitionToRoute('supervision.submissions.index');
  }
}
