import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubmissionReviewModel extends Model {
  @attr comment;

  @belongsTo('submission-review-status', { async: true, inverse: null }) status;
  @belongsTo('submission', { async: true, inverse: 'review' }) submission;
}
