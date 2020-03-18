import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

@classic
export default class InzendingFeedback extends Component {
  @service
  router;

  @service
  store;

  model = null;

  @equal('model.status.uri', 'http://data.lblod.info/melding-statuses/afgehandeld')
  isHandled;

  init() {
    super.init(...arguments);
    this.initStatuses.perform();
  }

  @task(function * () {
    let statuses = this.store.peekAll('melding-status');
    let teBehandelenStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/te-behandelen');
    let afgehandeldStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/afgehandeld');

    if (!teBehandelenStatus || !teBehandelenStatus.id || !afgehandeldStatus || !afgehandeldStatus.id) {
      statuses = yield this.store.findAll('melding-status', { reload: true });
      teBehandelenStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/te-behandelen');
      afgehandeldStatus = statuses.find(status => status.uri == 'http://data.lblod.info/melding-statuses/afgehandeld');
    }

    this.set('teBehandelenStatus', teBehandelenStatus);
    this.set('afgehandeldStatus', afgehandeldStatus);
  })
  initStatuses;

  @action
  toggleIsHandled() {
    if (this.isHandled)
      this.model.set('status', this.teBehandelenStatus);
    else
      this.model.set('status', this.afgehandeldStatus);
  }

  @action
  async save() {
    await this.model.save();
    this.router.transitionTo(this.parentIndexRoute);
  }

  @action
  cancel() {
    this.model.rollbackAttributes();
    this.router.transitionTo(this.parentIndexRoute);
  }
}
