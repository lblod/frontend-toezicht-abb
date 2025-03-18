/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default class UserSearchQueriesIndexRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service currentSession;
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  modelName = 'search-query';

  mergeQueryOptions() {
    return {
      'filter[user][:uri:]': this.currentSession.user.uri,
    };
  }
}
