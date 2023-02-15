import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Bestuursorgaan extends Model {
  @attr uri;
  @attr naam;
  @attr('date') bindingStart;
  @attr('date') bindingEinde;

  @belongsTo('bestuurseenheid', { async: true, inverse: null }) bestuurseenheid;
  @belongsTo('bestuursorgaan-classificatie-code', {
    async: true,
    inverse: null,
  })
  classificatie;
  @belongsTo('bestuursorgaan', { async: true, inverse: null })
  isTijdsspecialisatieVan;
  @hasMany('bestuursorgaan', { async: true, inverse: null })
  heeftTijdsspecialisaties;
}
