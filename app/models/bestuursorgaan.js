import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

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
