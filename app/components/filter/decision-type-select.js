import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout, restartableTask } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { DECISION_TYPE } from '../../models/concept-scheme';

export default class FilterDecisionTypeSelectComponent extends Component {
  @service store;

  @tracked selected = null;
  @tracked options;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    const options = yield this.store.query('concept', {
      filter: {
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });
    this.options = options.slice();

    this.updateSelectedValue();
  }

  @restartableTask
  *search(term) {
    yield timeout(600);
    let results = yield this.store.query('concept', {
      filter: {
        label: term,
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });

    return results.slice();
  }

  @action
  changeSelected(selected) {
    this.selected = selected;
    this.args.onSelectionChange(selected);
  }

  @action
  async updateSelectedValue() {
    if (this.args.value && !this.selected) {
      let selected = await this.store.query('concept', {
        filter: {
          id: this.args.value,
          'concept-schemes': {
            ':uri:': DECISION_TYPE,
          },
        },
        page: { size: this.args.value.split(',').length },
      });
      this.selected = selected.slice();
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
