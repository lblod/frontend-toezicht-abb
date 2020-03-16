import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class Gebruiker extends Model {
  @attr()
  voornaam;

  @attr()
  achternaam;

  @hasMany('account', { inverse: null})
  account;

  @hasMany('bestuurseenheid')
  bestuurseenheden;

  @computed('bestuurseenheden')
  get group() {
    return this.get('bestuurseenheden.firstObject');
  }

  @computed('voornaam', 'achternaam')
  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
