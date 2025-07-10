import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class Werkingsgebied extends Model {
  @attr uri;
  @attr naam;
  @attr niveau;

  @hasMany('bestuurseenheid', { async: true, inverse: null }) bestuurseenheid;
  @hasMany('bestuurseenheid', { async: true, inverse: null })
  bestuurseenhedenInProvincie;
  @belongsTo('concept', { async: true, inverse: null }) provincie;

  get longName() {
    let niveau = this.niveau;
    let naam = this.naam;
    return `${naam} (${niveau})`;
  }
}
