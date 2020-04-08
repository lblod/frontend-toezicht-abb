import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';

export default class InzendingFeedback extends Component {
  @service router;
  @service store;

  get isHandled() {
    if (this.args.model)
      return this.args.model.get('status.uri') == 'http://data.lblod.info/melding-statuses/afgehandeld';
    return false;
  }

  constructor() {
    super(...arguments);
    this.initStatuses.perform();
  }

  @task
  *initStatuses () {
    let statuses = this.store.peekAll('melding-status');
    let teBehandelenStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/te-behandelen');
    let afgehandeldStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/afgehandeld');

    if (!teBehandelenStatus || !teBehandelenStatus.id || !afgehandeldStatus || !afgehandeldStatus.id) {
      statuses = yield this.store.findAll('melding-status', { reload: true });
      teBehandelenStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/te-behandelen');
      afgehandeldStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/afgehandeld');
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
    this.router.transitionTo(this.args.parentIndexRoute);
  }

  @action
  async cancel() {
    await this.args.model.rollbackAttributes();
    this.router.transitionTo(this.args.parentIndexRoute);
  }
}
