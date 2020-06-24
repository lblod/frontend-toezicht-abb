import Route from '@ember/routing/route';

export default class UserSearchQueriesEditRoute extends Route {

  async model(params) {
    return await this.store.findRecord('search-query', params.id);
  }
}
