import Model, { attr } from '@ember-data/model';

export default Model.extend({
  label: attr(),
  code: attr()
});
