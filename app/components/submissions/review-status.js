import Component from '@glimmer/component';
import {
  TREAT_STATUS,
  TREATED_STATUS,
} from 'frontend-toezicht-abb/models/submission-review-status';

const REVIEW_STATUS_SKINS = {
  [TREAT_STATUS]: 'warning',
  [TREATED_STATUS]: 'success',
};

export default class SubmissionsReviewStatusComponent extends Component {
  get skin() {
    return REVIEW_STATUS_SKINS[this.args.statusURI];
  }
}
