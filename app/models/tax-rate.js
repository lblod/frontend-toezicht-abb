import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class TaxRate extends Model {
  @attr('number')
  amount;

  @attr('string')
  unit;

  @attr('string')
  base;

  @attr('string')
  remark;
}
