import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout, restartableTask } from 'ember-concurrency';

export default class FilterProvinceSelectComponent extends Component {
  @service store;

  @tracked selected = null;
  @tracked options;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const options = yield this.store.query('werkingsgebied', {
      filter: {
        niveau: 'provincie',
      },
      sort: 'naam',
    });
    this.options = options.slice();

    this.updateSelectedValue();
  }

  @restartableTask
  *search(term) {
    yield timeout(600);
    let results = yield this.store.query('werkingsgebied', {
      filter: {
        niveau: 'provincie',
        naam: term,
      },
    });

    return results.slice();
  }

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected && selected.map((d) => d.get('id')));
  }

  @action
  async updateSelectedValue() {
    if (this.args.value && !this.selected) {
      let selected = await this.store.query('werkingsgebied', {
        filter: { id: this.args.value },
        page: { size: this.args.value.split(',').length },
      });

      this.selected = selected.slice();
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
