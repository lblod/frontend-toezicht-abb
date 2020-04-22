import Model, {attr} from '@ember-data/model';

export default class SubmissionReviewStatus extends Model {
  @attr uri;
  @attr('string') label;
}
