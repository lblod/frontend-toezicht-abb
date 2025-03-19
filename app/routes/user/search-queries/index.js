import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserSearchQueriesIndexRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    return this.store.query('search-query', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      'filter[user][:uri:]': this.currentSession.user.uri,
    });
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    let controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise.finally(function () {
      controller.set('isLoadingModel', false);
    });

    return true; // bubble the loading event
  }
}
