import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  uri: attr(),
  naam: attr(),
  bindingStart: attr('date'),
  bindingEinde: attr('date'),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),
  classificatie: belongsTo('bestuursorgaan-classificatie-code', { inverse: null }),
  isTijdsspecialisatieVan: belongsTo('bestuursorgaan', { inverse: null }),
  heeftTijdsspecialisaties: hasMany('bestuursorgaan', { inverse: null })
});
