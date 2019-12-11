import Route from '@ember/routing/route';
import config from '../../../config/environment';

export default Route.extend({
  async model(params) {
    const queryParams = {
      'filter[id]': params.id,
      'filter[besluit-type][:uri:]': config.besluitTypeUri,
      'filter[regulation-type][:uri:]': config.regulationTypeUri,
      'filter[tax-type][:uri:]': config.taxTypeUri,
      'filter[nomenclature][:id:]': config.marCodes.join(','),

      include: [
        'status',
        'last-modifier',
        'bestuurseenheid',
        'inzending-type',
        'besluit-type',
        'bestuursorgaan',
        'tax-rates'
      ].join(',')
    };

    const inzendingen = await this.store.query('inzending-voor-toezicht', queryParams);
    return inzendingen.firstObject || [];
  },

  afterModel(model) {
    if (model.length == 0) {
      this.transitionTo('route-not-found', 404);
    }
  }
});
