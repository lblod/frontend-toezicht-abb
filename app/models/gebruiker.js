import Model, { attr, hasMany } from '@ember-data/model';

export default class Gebruiker extends Model {
  @attr()voornaam;
  @attr() achternaam;

  @hasMany('account', { inverse: null}) account;
  @hasMany('bestuurseenheid') bestuurseenheden;

  get group() {
    return this.get('bestuurseenheden.firstObject');
  }

  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
