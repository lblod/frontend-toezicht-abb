import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import config from '../config/environment';

export default class MarCodeSelect extends Component {
  @service store;

  @tracked selected = null;
  @tracked value = null; // id of selected record
  onSelectionChange = null;

  constructor() {
    super(...arguments);
    if (this.args.value) {
      this.selected = this.getMarCodesFromId(this.args.value);
    }
    const options = this.store.query('toezicht-nomenclature', {
      sort: 'code',
      'filter[:id:]': config.marCodes.join(',')
    });
    this.options = options;
  }

  @task(function* (term) {
    yield timeout(600);
    return this.options.filter(option => {
      return option.label.toUpperCase().includes(term.toUpperCase());
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map(d => d.get('id')));
  }

  @action
  updateSelectedValue() {
    if (this.args.value && !this.selected) {
      this.selected = this.getMarCodesFromId(this.args.value);
    } else if (!this.args.value) {
      this.selected = null;
    }
  }

  getMarCodesFromId(id) {
    const marCodes = this.store.query('toezicht-nomenclature', {
      filter: { id: id },
      page: { size: id.split(",").length}
    });
    return marCodes;
  }
}
