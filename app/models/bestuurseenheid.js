import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  naam: attr(),
  alternatieveNaam: attr('string-set'),
  werkingsgebied: belongsTo('werkingsgebied', { inverse: null }),
  provincie: belongsTo('werkingsgebied', { inverse: null }),
  classificatie: belongsTo('bestuurseenheid-classificatie-code', { inverse: null }),
  bestuursorganen: hasMany('bestuursorgaan', { inverse: null })
});
