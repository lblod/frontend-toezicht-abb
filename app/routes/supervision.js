import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { getOwner } from '@ember/application';

export default class SupervisionRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service currentSession;

  beforeModel( transition ){
    if (!(this.currentSession.canWrite || this.currentSession.canReadVlabel)) {
      const target = transition.targetName;
      const showSearchRoute = 'search.submissions.show';
      // Only redirect specifically to what you know exits. Else juste move away from these routes
      if(target == 'supervision.submissions.show' && getOwner(this).lookup(`route:${showSearchRoute}`)){
        this.transitionTo(showSearchRoute, transition.to.params.id);
      }
      else {
        this.transitionTo('search');
      }
    }
  }
}
