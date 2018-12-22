import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('inzending-voor-toezicht', {
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
  }
});
