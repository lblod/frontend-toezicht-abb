import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class IndexRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service currentSession;

  beforeModel() {
    if (this.currentSession.canWrite || this.currentSession.canReadVlabel) {
      this.transitionTo('supervision.submissions');
    }
    else {
      this.transitionTo('search.submissions');
    }
    super.beforeModel(...arguments);
  }
}
