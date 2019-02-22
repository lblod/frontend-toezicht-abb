import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  _statusId: null,
  isChecked: false,

  async didReceiveAttrs() {
    this._super(...arguments);
    if (!this._statusId) {
      const queryParams = {'filter[label]': 'te behandelen'};
      const toTreatStatus = await this.store.query('melding-status', queryParams).then(function(results) {
        return results.get('firstObject');
      });

      this.set('_statusId', toTreatStatus.id);
    }
  },

  actions: {
    setToTreatStatus() {
      if(this.isChecked) {
        this.set('statusId', null);
        this.set('isChecked', false);
      } else {
        if(this._statusId) {
          this.set('statusId', this._statusId);
          this.set('isChecked', true);
        }
      }
    }
  }
});
