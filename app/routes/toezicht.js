import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  async redirect() {
    if (this.currentSession.canReadVlabel) {
      this.transitionTo('toezicht.vlabel-inzendingen.index');
    } else {
      this.transitionTo('toezicht.inzendingen.index');
    }
  }
});
