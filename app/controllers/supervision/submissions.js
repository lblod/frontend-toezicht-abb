import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class SupervisionSubmissionsController extends Controller {

  @service currentSession;

  page = 0;
  size = 20;
  sort = '-sent-date';

  get hasActiveChildRoute() {
    return false;
  }

  get canReadVlabel() {
    return this.currentSession.canReadVlabel;
  }
}
