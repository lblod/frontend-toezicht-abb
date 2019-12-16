import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  beforeModel() {
    if (this.currentSession.canReadVlabel) {
      this.transitionTo('toezicht.vlabel-inzendingen.index');
    } else {
      this.transitionTo('toezicht.inzendingen.index');
    }
  }
});
