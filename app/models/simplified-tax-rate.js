import Model, { attr } from '@ember-data/model';

export default class SimplifiedTaxRate extends Model {
  @attr amount;
}
