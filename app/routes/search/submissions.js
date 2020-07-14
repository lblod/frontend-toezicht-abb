import {isEmpty} from '@ember/utils';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import search from '../../utils/mu-search';
import Snapshot from '../../utils/snapshot';
import SubmissionFilter from '../../utils/submission-filters';
import {tracked} from '@glimmer/tracking';
import {TREAT_STATUS} from '../../models/submission-review-status';

export default class SearchSubmissionsRoute extends Route {
  @service currentSession;
  @tracked filter;

  queryParams = {
    administrativeUnites: {refreshModel: true},
    administrativeUnitClassifications: {refreshModel: true},
    chartOfAccounts: {refreshModel: true},
    provinces: {refreshModel: true},
    decisionTypes: {refreshModel: true},
    regulationTypes: {refreshModel: true},
    sessionDateFrom: {refreshModel: true},
    sessionDateTo: {refreshModel: true},
    sentDateFrom: {refreshModel: true},
    sentDateTo: {refreshModel: true},
    search: {refreshModel: true},
    dateOfEntryIntoForceFrom: {refreshModel: true},
    dateOfEntryIntoForceTo: {refreshModel: true},
    dateNoLongerInForceFrom: {refreshModel: true},
    dateNoLongerInForceTo: {refreshModel: true},
    status: {refreshModel: true},
    governingBodyClassifications: {refreshModel: true},
    page: {refreshModel: true},
    size: {refreshModel: true},
    sort: {refreshModel: true},
  };

  lastParams = null;

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  // TODO make sure the page gets reset to 0 if the query-params changed
  async model(params) {
    this.filter = params;
    this.lastParams.stageLive(params);
    const query = {};

    if (this.lastParams.anyFieldChanged(Object.keys(params))) {
      params.page = 0;
    }

    // TODO generate this based on form configuration
    query[`:sqs:data`] = isEmpty(params.search) ? '*' : params.search;
    if (params.administrativeUnites) query[':terms:administrativeUnitURI'] = params.administrativeUnites;
    if (params.administrativeUnitClassifications) {
      query[':terms:administrativeUnitClassificationURI'] = params.administrativeUnitClassifications;
      if (params.governingBodyClassifications) query[':terms:governingBodyClassificationURI'] = params.governingBodyClassifications;
    }
    if (params.chartOfAccounts) query[':terms:chartOfAccountURI'] = params.chartOfAccounts;
    if (params.provinces) query[':terms:provinceURI'] = params.provinces;
    if (params.decisionTypes) {
      query[':terms:documentTypeURI'] = params.decisionTypes;
      if (params.regulationTypes) query[':terms:regulationTypeURI'] = params.regulationTypes;
    }
    if (params.sessionDateFrom) query[':gte:sessionDatetime'] = params.sessionDateFrom;
    if (params.sessionDateTo) query[':lte:sessionDatetime'] = params.sessionDateTo;
    if (params.sentDateFrom) query[':gte:sentDate'] = params.sentDateFrom;
    if (params.sentDateTo) query[':lte:sentDate'] = params.sentDateTo;
    if (params.dateOfEntryIntoForceFrom) query[':gte:dateOfEntryIntoForce'] = params.dateOfEntryIntoForceFrom;
    if (params.dateOfEntryIntoForceTo) query[':lte:dateOfEntryIntoForce'] = params.dateOfEntryIntoForceTo;
    if (params.dateNoLongerInForceFrom) query[':gte:dateNoLongerInForce'] = params.dateNoLongerInForceFrom;
    if (params.dateNoLongerInForceTo) query[':lte:dateNoLongerInForce'] = params.dateNoLongerInForceTo;
    if (params.status) query[':term:statusURI'] = TREAT_STATUS;

    this.lastParams.commit();

    return await search(
      '/search/submissions',
      params.page,
      params.size,
      params.sort,
      query,
      function(item) {
        item.attributes.id = item.id;
        return item.attributes;
      });
  }

  setupController(controller) {
    super.setupController(...arguments);

    if (controller.page !== this.lastParams.committed.page)
      controller.set('page', this.lastParams.committed.page);

    if (controller.filter !== this.filter)
      controller.set('filter', this.filter);
  }

  @action
  loading(/* transition, origin */) {
    // Cancel default loading template
    return;
  }
}
