import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';
import moment from 'moment';
import Snapshot from '../../utils/snapshot';
import config from '../../config/environment';

export default class ToezichtMeldingenRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession

  modelName = 'inzending-voor-toezicht'

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
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    bestuurseenheidIds: { refreshModel: true },
    classificatieIds: { refreshModel: true },
    marCodeIds: { refreshModel: true },
    provincieIds: { refreshModel: true },
    besluitTypeIds: { refreshModel: true },
    regulationTypeId: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
    sentDateFrom: { refreshModel: true },
    sentDateTo: { refreshModel: true },
    statusUri: { refreshModel: true },
    dateOfEntryIntoForceFrom: { refreshModel: true },
    dateOfEntryIntoForceTo: { refreshModel: true },
    endDateFrom: { refreshModel: true },
    endDateTo: { refreshModel: true }
  };

  constructor() {
    super(...arguments);
    this.lastParams = new Snapshot();
  }

  lastParams = null;

  mergeQueryOptions(params) {
    this.lastParams.stageLive(params);

    if (this.lastParams.anyFieldChanged(this.filterParams))
      params.page = 0;

    const query = {
      page: { number: params.page },
    };

    if (this.currentSession.canReadVlabel) {
      query['include'] = [
        'besluit-type',
        'regulation-type',
        'tax-type',
        'nomenclature'
      ].join(',');

      // Predefined filtering for Vlabel users
      query['filter[besluit-type][:uri:]'] = config.besluitTypeUri,
      query['filter[regulation-type][:uri:]'] = config.regulationTypeUri,
      query['filter[tax-type][:uri:]'] = config.taxTypeUri,
      query['filter[nomenclature][id]'] = config.marCodes.join(',');
    } else {
      query['include'] = [
        'bestuurseenheid.classificatie',
        'bestuurseenheid.provincie',
        'melding.status',
        'besluit-type',
        'regulation-type'
      ].join(',');
    }

    if (params.bestuurseenheidIds)
      query['filter[bestuurseenheid][id]'] = params.bestuurseenheidIds;

    if (params.classificatieIds)
      query['filter[bestuurseenheid][classificatie][id]'] = params.classificatieIds;

    if (params.marCodeIds)
      query['filter[nomenclature][id]'] = params.marCodeIds;

    if (params.provincieIds)
      query['filter[bestuurseenheid][provincie][id]'] = params.provincieIds;

    if (params.besluitTypeIds) {
      query['filter[besluit-type][id]'] = params.besluitTypeIds;
      if (params.regulationTypeId)
        query['filter[regulation-type][id]'] = params.regulationTypeId;
    }

    if (params.sessionDateFrom)
      query['filter[:gte:session-date]'] = params.sessionDateFrom;

    if (params.sessionDateTo)
      query['filter[:lte:session-date]'] = params.sessionDateTo;

    if (params.sentDateFrom)
      query['filter[:gte:sent-date]'] = params.sentDateFrom;

    if (params.sentDateTo)
      query['filter[:lte:sent-date]'] = params.sentDateTo;

    if (params.dateOfEntryIntoForceFrom)
      query['filter[:gte:date-of-entry-into-force]'] = moment(params.dateOfEntryIntoForceFrom).format('YYYY-MM-DD');

    if (params.dateOfEntryIntoForceTo)
      query['filter[:lte:date-of-entry-into-force]'] = moment(params.dateOfEntryIntoForceTo).format('YYYY-MM-DD');

    if (params.endDateFrom)
      query['filter[:gte:end-date]'] = moment(params.endDateFrom).format('YYYY-MM-DD');

    if (params.endDateTo)
      query['filter[:lte:end-date]'] = moment(params.endDateTo).format('YYYY-MM-DD');

    if (params.statusUri)
      query['filter[melding][status][:uri:]'] = params.statusUri;

    this.lastParams.commit();

    return query;
  }

  setupController(controller) {
    super.setupController(...arguments);

    if (controller.page != this.lastParams.committed.page)
      controller.set('page', this.lastParams.committed.page);
  }
}
