import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class SupervisionSubmissionsController extends Controller {

  @service currentSession;

  get canReadVlabel() {
    return this.currentSession.canReadVlabel;
  }
}
