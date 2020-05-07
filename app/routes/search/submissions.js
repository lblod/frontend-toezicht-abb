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
    chartOfAccounts: { refreshModel: true },
    provinces: { refreshModel: true },
    decisionTypes: { refreshModel: true },
    regulationTypes: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
    sentDateFrom: { refreshModel: true },
    sentDateTo: { refreshModel: true },
    search: { refreshModel: true },
    dateOfEntryIntoForceFrom: { refreshModel: true },
    dateOfEntryIntoForceTo: { refreshModel: true },
    endDateFrom: { refreshModel: true },
    endDateTo: { refreshModel: true },
    status: {refreshModel: true},
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

    if(this.lastParams.anyFieldChanged(this.filter.keys) ) {
      params.page = 0;
    }

    query[`:sqs:data`] = isEmpty(params.search) ? "*" : params.search;
    if( params.administrativeUnites ) query[":terms:administrativeUnitUUID"] = params.administrativeUnites;
    if( params.administrativeUnitClassifications ) query[":terms:administrativeUnitClassificationUUID"] = params.administrativeUnitClassifications;
    if( params.chartOfAccounts ) query[":terms:chartOfAccountUUID"] = params.chartOfAccounts;
    if( params.provinces ) query[":terms:provinceUUID"] = params.provinces;
    if( params.decisionTypes ) {
      query[":terms:documentTypeUUID"] = params.decisionTypes;
      if (params.regulationTypeIds) query[":terms:regulationTypeUUID"] = params.regulationTypes;
    }
    if( params.sessionDateFrom ) query[":gte:sessionDateTime"] = params.sessionDateFrom;
    if( params.sessionDateTo ) query[":lte:sessionDateTime"] = params.sessionDateTo;
    if( params.sentDateFrom ) query[":gte:sentDate"] = params.sentDateFrom;
    if( params.sentDateTo ) query[":lte:sentDate"] = params.sentDateTo;
    if( params.dateOfEntryIntoForceFrom ) query[":gte:dateOfEntryIntoForce"] = params.dateOfEntryIntoForceFrom;
    if( params.dateOfEntryIntoForceTo ) query[":lte:dateOfEntryIntoForce"] = params.dateOfEntryIntoForceTo;
    if( params.endDateFrom ) query[":gte:endDate"] = params.endDateFrom;
    if( params.endDateTo ) query[":lte:endDate"] = params.endDateTo;
    if( params.status ) query[":terms:statusUUID"] = params.status;

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
