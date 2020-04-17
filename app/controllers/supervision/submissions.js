import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import ENV from 'frontend-toezicht-abb/config/environment';

export default class SupervisionSubmissionsController extends Controller {
  @service router;
  @service currentSession;

  page = 0;
  size = 20;
  sort = '-sent-date';

  constructor() {
    super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
  }

  get hasActiveChildRoute() {
      return this.router.currentRouteName.startsWith('supervision.submissions')
        && this.router.currentRouteName !== 'supervision.submissions.index';
  }

  get canReadVlabel() {
    return this.currentSession.canReadVlabel;
  }
}
