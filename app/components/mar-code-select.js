import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import config from '../config/environment';

export default class MarCodeSelect extends Component {
  @service store

  @tracked selected = null
  @tracked options

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const options = yield this.store.query('toezicht-nomenclature', {
      sort: 'code',
      'filter[:id:]': config.marCodes.join(','),
      page: { size: config.marCodes.length }
    });
    this.options = options;

    this.updateSelectedValue();
  }

  @task
  *search (term) {
    yield timeout(600);
    return this.options.filter(option => {
      return option.label.toUpperCase().includes(term.toUpperCase());
    });
  }

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map(d => d.get('id')));
  }

  @action
  async updateSelectedValue() {
    if (this.args.value && !this.selected) {
      this.selected = await this.store.query('toezicht-nomenclature', {
        filter: { id: this.args.value },
        page: { size: this.args.value.split(',').length}
      });
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
