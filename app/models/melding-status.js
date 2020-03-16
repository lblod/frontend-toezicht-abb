import classic from 'ember-classic-decorator';
import { equal } from '@ember/object/computed';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class MeldingStatus extends Model {
  @attr()
  uri;

  @attr()
  label;

  @hasMany('inzending-voor-toezicht-melding', { inverse: null })
  meldingen;

  @equal('uri', 'http://data.lblod.info/melding-statuses/afgehandeld')
  isAfgehandeld;

  @equal('uri', 'http://data.lblod.info/melding-statuses/te-behandelen')
  isTeBehandelen;
}
