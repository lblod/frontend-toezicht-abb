import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

import DataTableRouteMixin from 'ember-data-table/mixins/route';
import moment from 'moment';

import Snapshot from "../../utils/snapshot";
import {VLABEL_CHART_OF_ACCOUNTS, VLABEL_TYPE} from "../../models/concept";

export default class SupervisionSubmissionsRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession;

  modelName = 'submission';

  filterParams = [
    'bestuurseenheidIds',
    'classificatieIds',
    'governingBodyClassificationIds',
    'marCodeIds',
    'provincieIds',
    'besluitTypeIds',
    'regulationTypeIds',
    'sessionDateFrom',
    'sessionDateTo',
    'sentDateFrom',
    'sentDateTo',
    'statusUri',
    'dateOfEntryIntoForceFrom',
    'dateOfEntryIntoForceTo',
    'endDateFrom',
    'endDateTo',
    'size',
    'sort'
  ];

  queryParams = {
    page: {refreshModel: true},
    size: {refreshModel: true},
    sort: {refreshModel: true},
    // filter params
    bestuurseenheidIds: {refreshModel: true},
    classificatieIds: {refreshModel: true},
    governingBodyClassificationIds: {refreshModel: true},
    marCodeIds: {refreshModel: true},
    provincieIds: {refreshModel: true},
    besluitTypeIds: {refreshModel: true},
    regulationTypeIds: {refreshModel: true},
    sessionDateFrom: {refreshModel: true},
    sessionDateTo: {refreshModel: true},
    sentDateFrom: {refreshModel: true},
    sentDateTo: {refreshModel: true},
    statusUri: {refreshModel: true},
    dateOfEntryIntoForceFrom: {refreshModel: true},
    dateOfEntryIntoForceTo: {refreshModel: true},
    endDateFrom: {refreshModel: true},
    endDateTo: {refreshModel: true}
  };

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  mergeQueryOptions(params) {
    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(this.filterParams))
      params.page = 0;

    const query = {
      page: {number: params.page},
    };

    if (this.currentSession.canReadVlabel) {
      query['include'] = [
        'form-data.types',
        'form-data.chart-of-account',
        'organization.classificatie',
        'organization.provincie',
      ].join(',');
      query['filter[form-data][types][:uri:]'] = VLABEL_TYPE;
      query['filter[form-data][chart-of-account][id]'] = VLABEL_CHART_OF_ACCOUNTS.join(',');
    } else {
      query['include'] = [
        'organization.classificatie',
        'organization.provincie',
        'review.status',
        'form-data.decision-type',
        'form-data.regulation-type'
      ].join(',');
    }

    if (params.bestuurseenheidIds)
      query['filter[organization][:id:]'] = params.bestuurseenheidIds;

    if (params.classificatieIds) {
      query['filter[organization][classificatie][:id:]'] = params.classificatieIds;
      if(params.governingBodyClassificationIds) {
        query['filter[form-data][passed-by][is-tijdsspecialisatie-van][classificatie][:id:]'] = params.governingBodyClassificationIds;
      }
    }

    if (params.marCodeIds)
      query['filter[form-data][chart-of-account][:id:]'] = params.marCodeIds;

    if (params.provincieIds)
      query['filter[organization][provincie][:id:]'] = params.provincieIds;

    if (params.besluitTypeIds) {
      query['filter[form-data][decision-type][:id:]'] = params.besluitTypeIds;
      if (params.regulationTypeIds)
         query['filter[form-data][regulation-type][:id:]'] = params.regulationTypeIds;
    }

    if (params.sessionDateFrom)
      query['filter[form-data][:gte:session-started-at-time]'] = params.sessionDateFrom;

    if (params.sessionDateTo)
      query['filter[form-data][:lte:session-started-at-time]'] = params.sessionDateTo;

    if (params.sentDateFrom)
      query['filter[:gte:sent-date]'] = params.sentDateFrom;

    if (params.sentDateTo)
      query['filter[:lte:sent-date]'] = params.sentDateTo;

    if (params.dateOfEntryIntoForceFrom)
      query['filter[form-data][:gte:first-date-in-force]'] = moment(params.dateOfEntryIntoForceFrom).format('YYYY-MM-DD');

    if (params.dateOfEntryIntoForceTo)
      query['filter[form-data][:lte:first-date-in-force]'] = moment(params.dateOfEntryIntoForceTo).format('YYYY-MM-DD');

    if (params.endDateFrom)
      query['filter[form-data][:gte:date-no-longer-in-force]'] = moment(params.endDateFrom).format('YYYY-MM-DD');

    if (params.endDateTo)
      query['filter[form-data][:lte:date-no-longer-in-force]'] = moment(params.endDateTo).format('YYYY-MM-DD');

    if (params.statusUri)
      query['filter[review][status][:uri:]'] = params.statusUri;

    this.lastParams.commit();

    return query;
  }

  setupController(controller) {
    super.setupController(...arguments);
    if (controller.page !== this.lastParams.committed.page)
      controller.set('page', this.lastParams.committed.page);
  }
}
