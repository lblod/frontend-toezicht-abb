import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from '../config/environment';

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const options = this.store.query('toezicht-nomenclature', {
      sort: 'code',
      'filter[:id:]': config.marCodes.join(',')
    });
    this.set('options', options);
  },

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.value && !this.selected) {
      const marCodes = this.store.query('toezicht-nomenclature', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', marCodes);
    } else if (!this.value) {
      this.set('selected', null);
    }
  },

  selected: null,
  value: null, // id of selected record
  onSelectionChange: null,

  search: task(function* (term) {
    yield timeout(600);
    return this.store.query('toezicht-nomenclature', {
      sort: 'code',
      filter: term
    });
  }),

  actions: {
    changeSelected(selected) {
      this.set('selected', selected);
      this.onSelectionChange(selected && selected.map(d => d.get('id')));
    }
  }
});
