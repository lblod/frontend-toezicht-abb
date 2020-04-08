import Model, { attr, hasMany } from '@ember-data/model';

export const TO_TREAT_STATUS = 'http://data.lblod.info/melding-statuses/te-behandelen';
export const TREATENED_STATUS = 'http://data.lblod.info/melding-statuses/afgehandeld';

export default class MeldingStatus extends Model {
  @attr uri
  @attr label

  @hasMany('inzending-voor-toezicht-melding', { inverse: null }) meldingen

  get isAfgehandeld() {
    return this.uri == TREATENED_STATUS;
  }

  get isTeBehandelen() {
    return this.uri == TO_TREAT_STATUS;
  }
}
