import classic from 'ember-classic-decorator';
import FormSolution from '@lblod/ember-mu-dynamic-forms/models/form-solution' ;
import { belongsTo } from '@ember-data/model';

@classic
export default class _FormSolution extends FormSolution {
  @belongsTo('inzending-voor-toezicht')
  inzendingVoorToezicht;
}
