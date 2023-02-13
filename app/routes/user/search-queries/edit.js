import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserSearchQueriesEditRoute extends Route {
  @service store;

  async model(params) {
    return await this.store.findRecord('search-query', params.id);
  }
}
