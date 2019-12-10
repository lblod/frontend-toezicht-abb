import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),
  router: service(),

  redirect(model, transition) {
    const targetName = transition.targetName;
    if (this.currentSession.canReadVlabel) {
      // if the target route is in the vlabel domain we transition to it,
      // otherwise as we have the vlabel rights we redirect to the vlabel index.
      if (targetName.split('.')[1] == 'vlabel-inzendingen') {
        this.transitionTo(targetName);
      } else {
        this.transitionTo('toezicht.vlabel-inzendingen');
      }
    } else {
      // if the target route is in the "regular" domain we transition to it,
      // otherwise as we have the "regular" rights we redirect to the "regular" index.
      if (targetName.split('.')[1] == 'inzendingen') {
        this.transitionTo(targetName);
      } else {
        this.transitionTo('toezicht.inzendingen');
      }
    }
  }
});
