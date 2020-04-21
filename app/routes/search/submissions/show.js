import Route from '@ember/routing/route';

export default class SearchSubmissionsShowRoute extends Route {
  model(params) {
    return this.store.find('submission', params.id);
  }
}
