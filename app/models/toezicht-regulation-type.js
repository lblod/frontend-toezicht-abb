import Model, { attr } from '@ember-data/model';

export default class ToezichtRegulationType extends Model {
  @attr()
  label;

  @attr()
  position;
}
