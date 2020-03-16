import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

@classic
export default class Bestuurseenheid extends Model {
  @attr()
  naam;

  @attr('string-set')
  alternatieveNaam;

  @belongsTo('werkingsgebied', { inverse: null })
  werkingsgebied;

  @belongsTo('werkingsgebied', { inverse: null })
  provincie;

  @belongsTo('bestuurseenheid-classificatie-code', { inverse: null })
  classificatie;

  @hasMany('bestuursorgaan', { inverse: null })
  bestuursorganen;
}
