import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'inzending-voor-toezicht',
  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    bestuurseenheidId: { refreshModel: true },
    classificatieId: { refreshModel: true },
    provincieId: { refreshModel: true },
    besluitTypeId: { refreshModel: true },
    toezichtRegulationTypeId: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
    sentDateFrom: { refreshModel: true },
    sentDateTo: { refreshModel: true },
    statusUri: { refreshModel: true }
  },
  mergeQueryOptions(params) {
    const query = {
      include: [
        'bestuurseenheid.classificatie',
        'bestuurseenheid.provincie',
        'melding.status',
        'besluit-type',
        //'toezicht-regulation-type'
      ].join(',')
    };

    if (params.bestuurseenheidId)
      query['filter[bestuurseenheid][id]'] = params.bestuurseenheidId;

    if (params.classificatieId)
      query['filter[bestuurseenheid][classificatie][id]'] = params.classificatieId;

    if (params.provincieId)
      query['filter[bestuurseenheid][provincie][id]'] = params.provincieId;

    if (params.besluitTypeId)
      query['filter[besluit-type][id]'] = params.besluitTypeId;

    if (params.toezichtRegulationTypeId)
      query['filter[regulation-type][id]'] = params.toezichtRegulationTypeId;

    if (params.sessionDateFrom)
      query['filter[:gte:session-date]'] = params.sessionDateFrom;

    if (params.sessionDateTo)
      query['filter[:lte:session-date]'] = params.sessionDateTo;

    if (params.sentDateFrom)
      query['filter[:gte:sent-date]'] = params.sentDateFrom;

    if (params.sentDateTo)
      query['filter[:lte:sent-date]'] = params.sentDateTo;

    if (params.statusUri)
      query['filter[melding][status][:uri:]'] = params.statusUri;

    return query;
  }
});
