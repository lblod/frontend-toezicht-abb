import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { getQueryParams } from '../../../utils/filter-form-helpers';

export default class UserSearchQueriesNewRoute extends Route {
  @tracked filter;

  queryParams;

  constructor() {
    super(...arguments);
    this.queryParams = getQueryParams({refreshModel: false});
  }

  async model(params) {
    this.filter = params;
  }

  setupController(controller) {
    super.setupController(...arguments);

    if (controller.filter !== this.filter)
      controller.set('filter', this.filter);
  }

  resetController(controller, isExiting) {
    if (isExiting) {
     // NOTE: To make sure the new form does not have "sticky" query-params
      const keys = Object.keys( controller.filter);
      for (let key of keys) {
        controller.set(key, null);
      }
    }
  }
}
