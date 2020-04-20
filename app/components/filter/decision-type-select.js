import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {timeout} from 'ember-concurrency';
import {task, restartableTask} from 'ember-concurrency-decorators';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

const DECISION_TYPE_CONCEPT_SCHEME = 'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5'

export default class FilterDecisionTypeSelectComponent extends Component {
  @service store

  @tracked selected = null
  @tracked options

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  * loadData() {
    const options = yield this.store.query('concept', {
      filter: {
        "concept-schemes": {
          ":uri:": DECISION_TYPE_CONCEPT_SCHEME
        }
      },
      sort: 'label',
      page: {size: 100}
    });
    this.options = options;

    this.updateSelectedValue();
  }

  @restartableTask
  * search(term) {
    yield timeout(600);
    return this.store.query('concept', {
      filter: {
        label: term,
        "concept-schemes": {
          ":uri:": DECISION_TYPE_CONCEPT_SCHEME
        }
      },
      sort: 'label',
      page: {size: 100}
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
      this.selected = await this.store.query('concept', {
        filter: {
          id: this.args.value,
          "concept-schemes": {
            ":uri:": DECISION_TYPE_CONCEPT_SCHEME
          }
        },
        page: {size: this.args.value.split(',').length}
      });
    } else if (!this.args.value) {
      this.selected = null;
    }
  }
}
