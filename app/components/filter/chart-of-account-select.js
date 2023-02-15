import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout, restartableTask } from 'ember-concurrency';
import { CHART_OF_ACCOUNT } from '../../models/concept-scheme';

export default class FilterChartOfAccountSelectComponent extends Component {
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
          ':uri:': CHART_OF_ACCOUNT,
        },
      },
      sort: 'search-label',
    });
    this.options = options.slice();

    this.updateSelectedValue();
  }

  @restartableTask
  *search(term) {
    yield timeout(600);
    let results = yield this.store.query('concept', {
      filter: {
        'search-label': term,
        'concept-schemes': {
          ':uri:': CHART_OF_ACCOUNT,
        },
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
      let selected = await this.store.query('concept', {
        filter: {
          id: this.args.value,
          'concept-schemes': {
            ':uri:': CHART_OF_ACCOUNT,
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
