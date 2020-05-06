import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";

import {action} from '@ember/object';

import {task} from "ember-concurrency-decorators";

import {DECISION_TYPE} from "../../models/concept-scheme";

export default class SubmissionsSearchTableComponent extends Component {

  @tracked decisionTypes = []

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  * loadData() {
    if (this.args.filter.decisionTypes) {
      this.decisionTypes = yield this.store.query('concept', {
        filter: {
          id: this.args.filter.decisionTypes,
          "concept-schemes": {
            ":uri:": DECISION_TYPE
          }
        },
        page: {size: this.args.filter.decisionTypes.split(',').length}
      });
    }
  }

  // TODO
  get regulationTypeIsSelected() {
    return this.decisionTypes.filterBy('isRegulation', true).length > 0;
  }

  @action
  selectDecisionTypes(types) {
    this.decisionTypes = types;
    this.args.filter.decisionTypes = types && types.map(d => d.id);

    if (!this.decisionTypes.find(type => type.isRegulation))
      this.args.filter.regulationTypes = null;

    this.args.onFilterChange();
  }
}
