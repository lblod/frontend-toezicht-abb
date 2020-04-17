import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class Account extends Model {
  @attr()
  voId;

  @attr()
  provider;

  @belongsTo('gebruiker', { inverse: null})
  gebruiker;
}
