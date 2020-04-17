import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

import DataTableRouteMixin from 'ember-data-table/mixins/route';

import config from '../../config/environment';
import Snapshot from "../../utils/snapshot";

// TODO do selective filtering based on the model, based on if the user is a Vlabel User
export default class SupervisionSubmissionsRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession;

  modelName = 'submission';

  queryParams = {
    page: {refreshModel: true},
    size: {refreshModel: true},
    sort: {refreshModel: true}
  };

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  mergeQueryOptions(params) {
    this.lastParams.stageLive(params);

    const filterParams = [
      'size',
      'sort'
    ];

    if (this.lastParams.anyFieldChanged(filterParams))
      params.page = 0;

    let query;
    if (this.currentSession.canReadVlabel) {
      // TODO correct inclusions and filtering
      query = {
        page: {number: params.page}
      }
      // query['filter[besluit-type][:uri:]'] = config.besluitTypeUri;
      // query['filter[form-data][types][:uri:]'] = config.regulationTypeUri;
      // query['filter[form-data][tax-type][:uri:]'] = config.taxTypeUri;
      // query['filter[form-data][chart-of-account][id]'] = config.marCodes.join(',');
    } else {
      query = {
        page: {number: params.page}
      }
    }

    this.lastParams.commit();
    return query;
  }

  setupController(controller) {
    super.setupController(...arguments);
    if (controller.page !== this.lastParams.committed.page)
      controller.set('page', this.lastParams.committed.page);
  }
}
