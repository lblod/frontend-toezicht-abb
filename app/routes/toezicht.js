import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

@classic
export default class ToezichtRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service
  currentSession;

  @service
  router;

  redirect(model, transition) {
    const targetName = transition.targetName;
    let splittedRouteName = targetName.split('.');

    if (this.currentSession.canReadVlabel) {
      splittedRouteName[1] = 'vlabel-inzendingen';
    } else {
      splittedRouteName[1] = 'inzendingen';
    }

    const routeName = splittedRouteName.join('.');

    if (splittedRouteName[2] == 'show') {
      this.transitionTo(routeName, transition.to.params.id);
    } else {
      this.transitionTo(routeName);
    }
  }
}
