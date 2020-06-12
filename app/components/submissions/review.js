import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import {TREATED_STATUS, TREAT_STATUS} from "../../models/submission-review-status";

export default class SubmissionsReviewComponent extends Component {
  @service router;
  @service store;

  get isHandled() {
    if (this.args.model)
      return this.args.model.get('status.uri') === TREATED_STATUS;
    return false;
  }

  constructor() {
    super(...arguments);
    this.initStatuses.perform();
  }

  @task
  *initStatuses () {
    let statuses = this.store.peekAll('submission-review-status');
    let teBehandelenStatus = statuses.find(status => status.uri === TREAT_STATUS);
    let afgehandeldStatus = statuses.find(status => status.uri === TREATED_STATUS);

    if (!teBehandelenStatus || !teBehandelenStatus.id || !afgehandeldStatus || !afgehandeldStatus.id) {
      statuses = yield this.store.findAll('submission-review-status', { reload: true });
      teBehandelenStatus = statuses.find(status => status.uri === TREAT_STATUS);
      afgehandeldStatus = statuses.find(status => status.uri ===TREATED_STATUS);
    }

    this.teBehandelenStatus = teBehandelenStatus;
    this.afgehandeldStatus = afgehandeldStatus;
  }

  @action
  toggleIsHandled() {
    if (this.isHandled)
      this.args.model.status = this.teBehandelenStatus;
    else
      this.args.model.status = this.afgehandeldStatus;
  }

  @action
  async save() {
    await this.args.model.save();
    this.args.onClose();
  }

  @action
  async cancel() {
    await this.args.model.rollbackAttributes();
    this.args.onClose();
  }
}
