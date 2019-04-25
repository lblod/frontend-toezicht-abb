import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'inzending-voor-toezicht',
  queryParams: {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    // filter params
    bestuurseenheidIds: { refreshModel: true },
    classificatieIds: { refreshModel: true },
    provincieIds: { refreshModel: true },
    besluitTypeIds: { refreshModel: true },
    regulationTypeId: { refreshModel: true },
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
        'regulation-type'
      ].join(',')
    };

    if (params.bestuurseenheidIds)
      query['filter[bestuurseenheid][id]'] = params.bestuurseenheidIds;

    if (params.classificatieIds)
      query['filter[bestuurseenheid][classificatie][id]'] = params.classificatieIds;

    if (params.provincieIds)
      query['filter[bestuurseenheid][provincie][id]'] = params.provincieIds;

    if (params.besluitTypeIds)
      query['filter[besluit-type][id]'] = params.besluitTypeIds;

    if (params.regulationTypeId)
      query['filter[regulation-type][id]'] = params.regulationTypeId;

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
