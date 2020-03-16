import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class InzendingVoorToezichtMelding extends Model {
  @attr()
  description;

  @belongsTo('melding-status', { inverse: null })
  status;

  @belongsTo('inzending-voor-toezicht', { inverse: null })
  inzendingVoorToezicht;
}
