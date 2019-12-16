import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import moment from 'moment';
import config from '../../config/environment';
import Snapshot from '../../utils/snapshot';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'inzending-voor-toezicht',

  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    bestuurseenheidIds: { refreshModel: true },
    marCodeIds: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
    sentDateFrom: { refreshModel: true },
    sentDateTo: { refreshModel: true },
    dateOfEntryIntoForceFrom: { refreshModel: true },
    dateOfEntryIntoForceTo: { refreshModel: true },
    endDateFrom: { refreshModel: true },
    endDateTo: { refreshModel: true }
  },

  init() {
    this._super(...arguments);
    this.set('lastParams', new Snapshot());
  },

  lastParams: null,

  mergeQueryOptions(params) {
    this.lastParams.stageLive( params );

    if( !this.lastParams.fieldChanged('page') )
      params.page = 0;

    const query = {
      page: { number: params.page },
      include: [
        'besluit-type',
        'regulation-type',
        'tax-type',
        'nomenclature'
      ].join(',')
    };

    query['filter[besluit-type][:uri:]'] = config.besluitTypeUri,
    query['filter[regulation-type][:uri:]'] = config.regulationTypeUri,
    query['filter[tax-type][:uri:]'] = config.taxTypeUri,
    query['filter[nomenclature][id]'] = config.marCodes.join(',');

    if (params.bestuurseenheidIds)
      query['filter[bestuurseenheid][id]'] = params.bestuurseenheidIds;

    if (params.marCodeIds)
      query['filter[nomenclature][id]'] = params.marCodeIds;

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

    this.lastParams.commit();

    return query;
  },


  setupController(controller) {
    this._super(...arguments);

    if( controller.page != this.lastParams.committed.page )
      controller.set('page', this.lastParams.committed.page);
  }

});
