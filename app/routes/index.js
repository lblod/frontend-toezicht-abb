import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class IndexRoute extends Route {
  @service
  currentSession;

  beforeModel() {
    if (this.currentSession.canReadVlabel) {
      this.transitionTo('toezicht.vlabel-inzendingen.index');
    } else {
      this.transitionTo('toezicht.inzendingen.index');
    }
  }
}
