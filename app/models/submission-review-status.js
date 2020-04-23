import Model, {attr} from '@ember-data/model';

export const TREAT_STATUS = 'http://lblod.data.gift/concepts/d72999bf-2ef4-4332-bd6e-49c8a9e2498e';
export const TREATED_STATUS = 'http://lblod.data.gift/concepts/5b36ed48-491c-4177-ae31-31338dc46de1';

export default class SubmissionReviewStatus extends Model {
  @attr uri;
  @attr('string') label;
}
