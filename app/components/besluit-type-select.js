import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const options = this.store.query('besluit-type', {
      sort: 'label',
      page: { size: 1000 }
    });
    this.set('options', options);
  },

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.value && !this.selected) {
      const besluitType = this.store.findRecord('besluit-type', this.value);
      this.set('selected', besluitType);
      this.onInit(besluitType);
    } else if (!this.value) {
      this.set('selected', null);
    }
  },

  selected: null,
  value: null, // id of selected record
  onSelectionChange: null,

  search: task(function* (term) {
    yield timeout(600);
    return this.store.query('besluit-type', {
      filter: { label: term }
    });
  }),

  actions: {
    changeSelected(selected) {
      this.set('selected', selected);
      this.onSelectionChange(selected);
    }
  }
});
