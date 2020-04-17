import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class ToezichtDeliveryReportType extends Model {
  @attr()
  label;
}
