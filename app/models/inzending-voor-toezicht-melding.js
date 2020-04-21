import Model, { attr, belongsTo } from '@ember-data/model';

export default class InzendingVoorToezichtMelding extends Model {
  @attr()
  description;

  @belongsTo('melding-status', { inverse: null })
  status;

  @belongsTo('inzending-voor-toezicht', { inverse: null })
  inzendingVoorToezicht;
}
