import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
  address: attr(),
  replicatedFile: belongsTo('file', { inverse: null })
});
