import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import search from '../../utils/mu-search';
import Snapshot from '../../utils/snapshot';
import SubmissionFilter from "../../utils/submission-filters";
import {tracked} from "@glimmer/tracking";

export default class SearchSubmissionsRoute extends Route {
  @service currentSession;
  @tracked filter;

  queryParams = {
    administrativeUnites: { refreshModel: true },
    administrativeUnitClassifications: { refreshModel: true },
    // chartOfAccounts: { refreshModel: true },
    provinces: { refreshModel: true },
    decisionTypes: { refreshModel: true },
    regulationTypes: { refreshModel: true },
    searchString: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true }
  }

  lastParams = null;

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  model(params){
    this.filter = new SubmissionFilter(params);
    this.lastParams.stageLive( params );
    const query = {};

    if( !this.lastParams.anyFieldChanged(this.filter.keys) ) {
      params.page = 0;
    }

    query[`:sqs:data`] = isEmpty(params.searchString) ? "*" : params.searchString;
    if( params.administrativeUnites ) query["administrativeUnitUUID"] = params.administrativeUnites;
    if( params.administrativeUnitClassifications ) query["administrativeUnitClassificationUUID"] = params.administrativeUnitClassifications;
    if( params.provinces ) query["provinceUUID"] = params.provinces;
    if( params.decisionTypes ) query["documentTypeUUID"] = params.decisionTypes;
    if( params.regulationTypes ) query["regulationTypeUUID"] = params.regulationTypes;

    this.lastParams.commit();

    return search('/search/submissions', params.page, params.size, query, function(item) {
      item.attributes.id = item.id;
      return item.attributes;
    });
  }

  setupController(controller) {
    super.setupController(...arguments);

    if( controller.page !== this.lastParams.committed.page )
      controller.set('page', this.lastParams.committed.page );
    controller.set('filter', this.filter);
  }

  @action
  loading(/* transition, origin */) {
    // Cancel default loading template
    return;
  }
}
