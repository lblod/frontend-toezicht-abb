import Model, { attr, hasMany } from '@ember-data/model';

export default class Werkingsgebied extends Model {

  get longName() {
    let niveau = this.niveau;
    let naam = this.naam;
    return `${naam} (${niveau})`;
  }

  @attr()
  uri;

  @attr()
  naam;

  @attr()
  niveau;

  @hasMany('bestuurseenheid', { inverse: null })
  bestuurseenheid;

  @hasMany('bestuurseenheid', { inverse: null })
  bestuurseenhedenInProvincie;
}
