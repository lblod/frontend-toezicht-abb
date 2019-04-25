import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const options = this.store.query('werkingsgebied', {
      filter: {
        niveau: 'provincie'
      },
      sort: 'naam'
    });
    this.set('options', options);
  },

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.value && !this.selected) {
      const werkingsgebied = this.store.findRecord('werkingsgebied', this.value);
      this.set('selected', werkingsgebied);
    } else if (!this.value) {
      this.set('selected', null);
    }
  },

  selected: null,
  value: null, // id of selected record
  onSelectionChange: null,

  search: task(function* (term) {
    yield timeout(600);
    return this.store.query('werkingsgebied', {
      filter: {
        niveau: 'provincie',
        naam: term
      }
    });
  }),

  actions: {
    changeSelected(selected) {
      this.set('selected', selected)
      this.onSelectionChange(selected && selected.map(d => d.id));
    }
  }
});
