import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import moment from 'moment';
import config from '../../config/environment';

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
  mergeQueryOptions(params) {
    const query = {
      include: [
        'besluit-type',
        'regulation-type',
        'tax-type',
        'nomenclature'
      ].join(',')
    };

    query['filter[besluit-type][:uri:]'] = "http://data.lblod.info/DecisionType/5b3955cc006323233e711c482f3a6bf39a8d3eba6bbdb2c672bdfcf2b2985b03"; // Reglementen en verordeningen
    query['filter[regulation-type][:uri:]'] = "http://data.lblod.info/RegulationType/ef35b053c004a25069c58090d967ade753dd02586b0f76b916a0ca82b7294d0b"; // Belastingsreglement
    query['filter[tax-type][:uri:]'] = "http://data.lblod.info/TaxType/0a9c8b98da3f166b86cfe827bc0e6b779a4dc2f7a69e7be6031fd1959eaedc0d"; // Aanvullende belasting of opcentiem
    query['filter[nomenclature][:id:]'] = config.marCodes.join(','); // MAR7300, MAR7304 or MAR7305

    query['page[size]'] = 20;

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

    return query;
  }
});
