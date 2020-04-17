import classic from 'ember-classic-decorator';
import Model, { belongsTo, attr } from '@ember-data/model';

@classic
export default class FileAddress extends Model {
  @attr()
  address;

  @belongsTo('file', { inverse: null })
  replicatedFile;
}
