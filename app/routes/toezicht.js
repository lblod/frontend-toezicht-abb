import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),
  router: service(),

  redirect(model, transition) {
    const targetName = transition.targetName;
    let splittedRouteName = targetName.split('.');

    if (this.currentSession.canReadVlabel) {
      splittedRouteName[1] = 'vlabel-inzendingen';
    } else {
      splittedRouteName[1] = 'inzendingen';
    }

    const routeName = splittedRouteName.join('.');
    this.transitionTo(routeName);
  }
});
