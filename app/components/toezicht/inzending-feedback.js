import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  router: service(),
  store: service(),

  tagName: '',
  model: null,

  isHandled: equal('model.status.uri', 'http://data.lblod.info/melding-statuses/afgehandeld'),

  init() {
    this._super(...arguments);
    this.initStatuses.perform();
  },

  initStatuses: task(function * () {
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
  }),

  actions: {
    toggleIsHandled(value) {
      if (value)
        this.model.set('status', this.afgehandeldStatus);
      else
        this.model.set('status', this.teBehandelenStatus);
    },
    async save() {
      await this.model.save();
      this.router.transitionTo('toezicht.inzendingen.index');
    },
    cancel() {
      this.model.rollbackAttributes();
      this.router.transitionTo('toezicht.inzendingen.index');
    }
  }
});
