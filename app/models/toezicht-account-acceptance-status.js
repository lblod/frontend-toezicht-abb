import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class ToezichtAccountAcceptanceStatus extends Model {
  @attr()
  label;
}
