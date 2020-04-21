import Model, { belongsTo, attr } from '@ember-data/model';

export default class FileAddress extends Model {
  @attr()
  address;

  @belongsTo('file', { inverse: null })
  replicatedFile;
}
