import Model, { attr, hasMany } from '@ember-data/model';

export default class Gebruiker extends Model {
  @attr uri;

  @hasMany('account', { async: true, inverse: null }) account;
  @hasMany('bestuurseenheid', { async: true, inverse: null }) bestuurseenheden;
  @hasMany('search-query', { async: true, inverse: 'user' }) searchQueries;

  get group() {
    return this.hasMany('bestuurseenheden').value().firstObject;
  }

  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
