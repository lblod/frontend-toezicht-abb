import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class UserSearchQueriesIndexRoute extends Route.extend(AuthenticatedRouteMixin, DataTableRouteMixin) {
  modelName = 'search-query'
}
