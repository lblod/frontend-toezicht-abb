import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (this.currentSession.canWrite || this.currentSession.canReadVlabel) {
      this.router.transitionTo('supervision.submissions');
    } else {
      this.router.transitionTo('search.submissions');
    }
  }
}
