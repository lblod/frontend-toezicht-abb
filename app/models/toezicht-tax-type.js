import Model, { attr } from '@ember-data/model';

export default class ToezichtTaxType extends Model {
  @attr() uri;
  @attr() label;
}
