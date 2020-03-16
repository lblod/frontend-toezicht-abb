import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import config from '../config/environment';

@classic
export default class MarCodeSelect extends Component {
  @service
  store;

  async init() {
    super.init(...arguments);
    const options = this.store.query('toezicht-nomenclature', {
      sort: 'code',
      'filter[:id:]': config.marCodes.join(',')
    });
    this.set('options', options);
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    if (this.value && !this.selected) {
      const marCodes = this.store.query('toezicht-nomenclature', {
        filter: { id: this.value },
        page: { size: this.value.split(",").length}
      });
      this.set('selected', marCodes);
    } else if (!this.value) {
      this.set('selected', null);
    }
  }

  selected = null;
  value = null; // id of selected record
  onSelectionChange = null;

  @task(function* (term) {
    yield timeout(600);
    return this.options.filter(option => {
      return option.label.toUpperCase().includes(term.toUpperCase());
    });
  })
  search;

  @action
  changeSelected(selected) {
    this.set('selected', selected);
    this.onSelectionChange(selected && selected.map(d => d.get('id')));
  }
}
