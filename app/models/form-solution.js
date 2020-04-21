import FormSolution from '@lblod/ember-mu-dynamic-forms/models/form-solution' ;
import { belongsTo } from '@ember-data/model';

export default class _FormSolution extends FormSolution {
  @belongsTo('inzending-voor-toezicht') inzendingVoorToezicht;
}
