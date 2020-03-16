import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  description: attr(),
  status: belongsTo('melding-status', { inverse: null }),
  inzendingVoorToezicht: belongsTo('inzending-voor-toezicht', { inverse: null })
});
