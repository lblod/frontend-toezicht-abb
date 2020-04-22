import Model, {attr, belongsTo} from '@ember-data/model';

export default class SubmissionReviewModel extends Model {
 @attr comment;

 @belongsTo('submission-review-status') status;
 @belongsTo('submission') submission;
}
