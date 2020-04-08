import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

export default class BesluitTypeSelect extends Component {
  @service store

  @tracked selected = null
  @tracked options

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const options = yield this.store.query('besluit-type', {
      sort: 'label',
      page: { size: 1000 }
    });
    this.options = options;

    this.updateSelectedValue();
  }

  @task
  *search (term) {
    yield timeout(600);
    return this.store.query('besluit-type', {
      filter: { label: term },
      sort: 'label',
      page: { size: 1000 }
    });
  }

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected);
  }

  @action
  async updateSelectedValue() {
    if (this.args.value && !this.selected) {
      this.selected = await this.store.query('besluit-type', {
        filter: { id: this.args.value },
        page: { size: this.args.value.split(',').length}
      });
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
