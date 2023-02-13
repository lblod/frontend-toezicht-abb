import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service currentSession;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (this.currentSession.canWrite || this.currentSession.canReadVlabel) {
      this.transitionTo('supervision.submissions');
    } else {
      this.transitionTo('search.submissions');
    }
    super.beforeModel(...arguments);
  }
}
