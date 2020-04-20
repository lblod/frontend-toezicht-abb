import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FilterRegulationTypeSelectComponent extends Component {
  @service store

  @tracked selected = null
  @tracked options

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const options = yield this.store.query('toezicht-regulation-type', {
      sort: 'label',
      page: { size: 100 }
    });
    this.options = options;

    this.updateSelectedValue();
  }

  @restartableTask
  *search (term) {
    yield timeout(600);
    return this.store.query('toezicht-regulation-type', {
      filter: { label: term },
      sort: 'label',
      page: { size: 100 }
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
      this.selected = await this.store.query('toezicht-regulation-type', {
        filter: { id: this.args.value },
        page: { size: this.args.value.split(',').length}
      });
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
