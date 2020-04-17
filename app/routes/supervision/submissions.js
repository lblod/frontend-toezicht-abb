import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

import DataTableRouteMixin from 'ember-data-table/mixins/route';
import moment from 'moment';

import config from '../../config/environment';
import Snapshot from "../../utils/snapshot";

export default class SupervisionSubmissionsRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession;

  modelName = 'submission';

  filterParams = [
    'bestuurseenheidIds',
    'classificatieIds',
    'marCodeIds',
    'provincieIds',
    'besluitTypeIds',
    'regulationTypeId',
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
    marCodeIds: {refreshModel: true},
    provincieIds: {refreshModel: true},
    besluitTypeIds: {refreshModel: true},
    regulationTypeId: {refreshModel: true},
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

    const filterParams = [
      'size',
      'sort'
    ];

    if (this.lastParams.anyFieldChanged(filterParams))
      params.page = 0;

    const query = {
      page: {number: params.page},
    };

    if (this.currentSession.canReadVlabel) {
      query['include'] = [
        'form-data.types',
        'form-data.tax-type',
        'form-data.chart-of-account',
      ]
      query['filter[form-data][types][:uri:]'] = config.regulationTypeUri;
      query['filter[form-data][tax-type][:uri:]'] = config.taxTypeUri;
      query['filter[form-data][chart-of-account][id]'] = config.marCodes.join(',');

    } else {
      // TODO translate this to meldingsplichtige
      // query['include'] = [
      //   'bestuurseenheid.classificatie',
      //   'bestuurseenheid.provincie',
      //   'melding.status',
      //   'besluit-type',
      //   'regulation-type'
      // ].join(',');
    }

    if (params.bestuurseenheidIds)
      query['filter[organization][:id:]'] = params.bestuurseenheidIds;

    if (params.classificatieIds)
      query['filter[organization][classificatie][:id:]'] = params.classificatieIds;

    if (params.marCodeIds)
      query['[form-data][chart-of-account][:id:]'] = params.marCodeIds;

    if (params.provincieIds)
      query['filter[organization][provincie][:id:]'] = params.provincieIds;

    if (params.besluitTypeIds) {
      query['filter[form-data][types][:id:]'] = params.besluitTypeIds;
      if (params.regulationTypeId)
        query['filterform-data][types][:id:]'] = params.regulationTypeId;
    }

    if (params.sessionDateFrom)
      query['filter[form-data][session-started-at-time]'] = params.sessionDateFrom;

    if (params.sessionDateTo)
      query['filter[form-data][session-started-at-time]'] = params.sessionDateTo;

    if (params.sentDateFrom)
      query['filter[form-data][date-publication][:id:]'] = params.sentDateFrom;

    if (params.sentDateTo)
      query['filter[form-data][date-publication][:id:]'] = params.sentDateTo;

    if (params.dateOfEntryIntoForceFrom)
      query['filter[form-data][first-date-in-force][:id:]'] = moment(params.dateOfEntryIntoForceFrom).format('YYYY-MM-DD');

    if (params.dateOfEntryIntoForceTo)
      query['filter[form-data][first-date-in-force][:id:]'] = moment(params.dateOfEntryIntoForceTo).format('YYYY-MM-DD');

    if (params.endDateFrom)
      query['filter[form-data][date-no-longer-in-force][:id:]'] = moment(params.endDateFrom).format('YYYY-MM-DD');

    if (params.endDateTo)
      query['filter[form-data][date-no-longer-in-force][:id:]'] = moment(params.endDateTo).format('YYYY-MM-DD');

    if (params.statusUri)
      query['filter[status][:uri:]'] = params.statusUri;

    this.lastParams.commit();

    return query;
  }

  setupController(controller) {
    super.setupController(...arguments);
    if (controller.page !== this.lastParams.committed.page)
      controller.set('page', this.lastParams.committed.page);
  }
}
