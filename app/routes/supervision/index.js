import Route from '@ember/routing/route';

export default class SupervisionIndexRoute extends Route {
  beforeModel(/* transition */) {
    this.transitionTo('supervision.submissions');
  }
}
