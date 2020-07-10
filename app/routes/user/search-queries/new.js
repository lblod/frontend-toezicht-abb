import Route from '@ember/routing/route';

import {inject as service} from '@ember/service';

export default class UserSearchQueriesNewRoute extends Route {
  @service currentSession;

  async model() {
    const user = await this.currentSession.user;

    const query = this.store.createRecord('search-query', {
      user
    });
    await query.save();

    return query;
  }

  afterModel(model) {
    this.transitionTo('user.search-queries.edit', model.id);
  }
}
