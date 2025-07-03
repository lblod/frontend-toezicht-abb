import Model, { belongsTo, attr } from '@ember-data/model';

export default class SiteModel extends Model {
  @attr siteTypeName;

  @belongsTo('address', {
    inverse: null,
    async: true,
  })
  address;
}
