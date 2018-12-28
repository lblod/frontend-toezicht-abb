import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    const inzendingen = await this.store.query('inzending-voor-toezicht', {
      filter: {
        id: params.id
      },
      include: [
        'status',
        'last-modifier',
        'bestuurseenheid',
        'inzending-type',
        'besluit-type',
        'bestuursorgaan',
        'tax-rates'
      ].join(',')
    });
    return inzendingen.firstObject;
  },
  async afterModel(model) {
    const melding = await model.melding;

    if (!melding) {
      const statuses = await this.store.query('melding-status', {
        'filter[:uri:]': 'http://data.lblod.info/melding-statuses/te-behandelen'
      });
      const newMelding = this.store.createRecord('inzending-voor-toezicht-melding', {
        inzendingVoorToezicht: model,
        status: statuses.firstObject
      });
      return newMelding.save();
    } else {
      return null;
    }
  }
});
