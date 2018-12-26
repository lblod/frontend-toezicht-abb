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
    sessionDateStart: { refreshModel: true },
    sessionDateEnd: { refreshModel: true },
    sentDateStart: { refreshModel: true },
    sentDateEnd: { refreshModel: true }
  },
  mergeQueryOptions(params) {
    const query = {
      include: [
        'bestuurseenheid.classificatie',
        'bestuurseenheid.provincie',
        'status',
        'besluit-type'
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

    return query;
  }
});
