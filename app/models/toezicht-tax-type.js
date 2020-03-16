import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class ToezichtTaxType extends Model {
  @attr()
  uri;

  @attr()
  label;
}
