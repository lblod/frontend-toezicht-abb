import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

@classic
export default class Bestuursorgaan extends Model {
  @attr()
  uri;

  @attr()
  naam;

  @attr('date')
  bindingStart;

  @attr('date')
  bindingEinde;

  @belongsTo('bestuurseenheid', { inverse: null })
  bestuurseenheid;

  @belongsTo('bestuursorgaan-classificatie-code', { inverse: null })
  classificatie;

  @belongsTo('bestuursorgaan', { inverse: null })
  isTijdsspecialisatieVan;

  @hasMany('bestuursorgaan', { inverse: null })
  heeftTijdsspecialisaties;
}
