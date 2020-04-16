import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SupervisionSubmissionsRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'Submission';
  queryParams = {
    page: {refreshModel: true},
    size: {refreshModel: true},
    sort: {refreshModel: true}
  };
}
