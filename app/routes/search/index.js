import Route from '@ember/routing/route';

export default class SearchIndexRoute extends Route {
  beforeModel(/* transition */) {
    this.transitionTo('search.submissions');
  }
}
