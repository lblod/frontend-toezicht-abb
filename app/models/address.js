import Model, { belongsTo } from '@ember-data/model';

export default class AddressModel extends Model {

  @belongsTo('concept', {
    inverse: null,
    async: true,
  })
  provincie;

}
