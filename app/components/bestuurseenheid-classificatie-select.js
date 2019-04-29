import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const options = this.store.query('bestuurseenheid-classificatie-code', {
      sort: 'label'
    });
    this.set('options', options);
  },

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.value && !this.selected) {
      const classificaties = this.store.query('bestuurseenheid-classificatie-code', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', classificaties);
    } else if (!this.value) {
      this.set('selected', null);
    }
  },

  selected: null,
  value: null, // id of selected record
  onSelectionChange: null,

  search: task(function* (term) {
    yield timeout(600);
    return this.store.query('bestuurseenheid-classificatie-code', {
      filter: { label: term }
    });
  }),

  actions: {
    changeSelected(selected) {
      this.set('selected', selected);
      this.onSelectionChange(selected && selected.map(d => d.get('id')));
    }
  }
});
