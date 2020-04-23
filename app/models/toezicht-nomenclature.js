import Model, { attr } from '@ember-data/model';

export default class ToezichtNomenclature extends Model {
  @attr() label;
  @attr() code;
}
