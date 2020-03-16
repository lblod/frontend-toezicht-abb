import Model, { attr } from '@ember-data/model';

export default Model.extend({
  amount: attr('number'),
  unit: attr('string'),
  base: attr('string'),
  remark: attr('string')
});
