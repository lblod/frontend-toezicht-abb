import Model, { attr } from '@ember-data/model';

export default class SearchQueryModel extends Model {
  @attr() label;
  @attr() comment;
}
