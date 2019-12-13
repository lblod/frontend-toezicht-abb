import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.currentSession.canReadVlabel) {
      this.transitionTo('toezicht.vlabel-inzendingen.index');
    } else {
      this.transitionTo('toezicht.inzendingen.index');
    }
  }
});
