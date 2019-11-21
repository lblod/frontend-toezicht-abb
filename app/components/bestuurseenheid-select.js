import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const options = this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie']
    });
    this.set('options', options);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.value && !this.selected) {
      const bestuurseenheden = this.store.query('bestuurseenheid', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', bestuurseenheden);
    } else if (!this.value) {
      this.set('selected', null);
    }
  },

  selected: null,
  value: null, // id of selected record
  onSelectionChange: null,

  search: task(function* (term) {
    yield timeout(600);
    return this.store.query('bestuurseenheid', {
      sort: 'naam',
      include: ['classificatie'],
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
