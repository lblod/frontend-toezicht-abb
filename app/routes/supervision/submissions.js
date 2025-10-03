import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Snapshot from '../../utils/snapshot';
import { VLABEL_CHART_OF_ACCOUNTS, VLABEL_TYPE } from '../../models/concept';
import { parseISO, addDays } from 'date-fns';

export default class SupervisionSubmissionsRoute extends Route {
  @service currentSession;
  @service store;

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
    'sort',
  ];

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    bestuurseenheidIds: { refreshModel: true },
    classificatieIds: { refreshModel: true },
    governingBodyClassificationIds: { refreshModel: true },
    marCodeIds: { refreshModel: true },
    provincieIds: { refreshModel: true },
    besluitTypeIds: { refreshModel: true },
    regulationTypeIds: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
    sentDateFrom: { refreshModel: true },
    sentDateTo: { refreshModel: true },
    statusUri: { refreshModel: true },
    dateOfEntryIntoForceFrom: { refreshModel: true },
    dateOfEntryIntoForceTo: { refreshModel: true },
    endDateFrom: { refreshModel: true },
    endDateTo: { refreshModel: true },
  };

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  model(params) {
    return this.store.query('submission', this.getQueryOptions(params));
  }

  getQueryOptions(params) {
    this.lastParams.stageLive(params);

    if (
      this.lastParams.committed &&
      this.lastParams.anyFieldChanged(this.filterParams)
    )
      params.page = 0;

    const query = {
      sort: params.sort,
      page: { number: params.page },
    };

    if (this.currentSession.canReadVlabel) {
      query['include'] = [
        'form-data.types',
        'form-data.chart-of-account',
        'organization.classificatie',
        'organization.primary-site.address.provincie',
      ].join(',');
      query['filter[form-data][types][:uri:]'] = VLABEL_TYPE;
      query['filter[form-data][chart-of-account][id]'] =
        VLABEL_CHART_OF_ACCOUNTS.join(',');
    } else {
      query['include'] = [
        'organization.classificatie',
        'organization.primary-site.address.provincie',
        'review.status',
        'form-data.decision-type',
        'form-data.regulation-type',
      ].join(',');
    }

    if (params.bestuurseenheidIds)
      query['filter[organization][:id:]'] = params.bestuurseenheidIds;

    if (params.classificatieIds) {
      query['filter[organization][classificatie][:id:]'] =
        params.classificatieIds;
      if (params.governingBodyClassificationIds) {
        query[
          'filter[form-data][passed-by][is-tijdsspecialisatie-van][classificatie][:id:]'
        ] = params.governingBodyClassificationIds;
      }
    }

    if (params.marCodeIds)
      query['filter[form-data][chart-of-account][:id:]'] = params.marCodeIds;

    if (params.provincieIds)
      query['filter[organization][primary-site][address][provincie][:id:]'] =
        params.provincieIds;

    if (params.besluitTypeIds) {
      query['filter[form-data][decision-type][:id:]'] = params.besluitTypeIds;
      if (params.regulationTypeIds)
        query['filter[form-data][regulation-type][:id:]'] =
          params.regulationTypeIds;
    }

    if (params.sessionDateFrom)
      query['filter[form-data][:gte:session-started-at-time]'] = parseISO(
        params.sessionDateFrom,
      ).toISOString();

    if (params.sessionDateTo)
      query['filter[form-data][:lt:session-started-at-time]'] = addDays(
        parseISO(params.sessionDateTo),
        1,
      ).toISOString();

    if (params.sentDateFrom)
      query['filter[:gte:sent-date]'] = parseISO(
        params.sentDateFrom,
      ).toISOString();

    if (params.sentDateTo)
      query['filter[:lt:sent-date]'] = addDays(
        parseISO(params.sentDateTo),
        1,
      ).toISOString();

    if (params.dateOfEntryIntoForceFrom)
      query['filter[form-data][:gte:first-date-in-force]'] = moment(
        params.dateOfEntryIntoForceFrom,
      ).format('YYYY-MM-DD');

    if (params.dateOfEntryIntoForceTo)
      query['filter[form-data][:lte:first-date-in-force]'] = moment(
        params.dateOfEntryIntoForceTo,
      ).format('YYYY-MM-DD');

    if (params.endDateFrom)
      query['filter[form-data][:gte:date-no-longer-in-force]'] = moment(
        params.endDateFrom,
      ).format('YYYY-MM-DD');

    if (params.endDateTo)
      query['filter[form-data][:lte:date-no-longer-in-force]'] = moment(
        params.endDateTo,
      ).format('YYYY-MM-DD');

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

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    let controller = this.controllerFor(this.routeName);
    controller.set('isLoadingModel', true);
    transition.promise.finally(function () {
      controller.set('isLoadingModel', false);
    });

    return true; // bubble the loading event
  }
}
