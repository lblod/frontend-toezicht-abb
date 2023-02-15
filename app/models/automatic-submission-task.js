import Model, { attr, belongsTo } from '@ember-data/model';

export default class AutomaticSubmissionTask extends Model {
  @attr created;

  @belongsTo('submission', { async: true, inverse: 'task' }) submission;
}
