import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";

import {action} from '@ember/object';

import {task} from "ember-concurrency-decorators";
import moment from 'moment';

import {DECISION_TYPE} from "../../models/concept-scheme";
import {TREAT_STATUS} from "../../models/submission-review-status";

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

  get regulationTypeIsSelected() {
    return this.decisionTypes.filterBy('isRegulation', true).length > 0;
  }

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get isStatusFilterEnabled() {
    return this.args.filter.status != null;
  }

  set isStatusFilterEnabled(value) {
    // TODO remove-function once WuSwitch isn't 2-way bounded anymore
    // This setter has no meaning because the status is correctly updated by the setToTreatStatus
    return this._blackhole = value;
  }

  @action
  selectDecisionTypes(types) {
    this.decisionTypes = types;
    this.args.filter.decisionTypes = types && types.map(d => d.id);

    if (!this.decisionTypes.find(type => type.isRegulation))
      this.args.filter.regulationTypes = null;

    this.args.onFilterChange();
  }

  @action
  setToTreatStatus(event) {
    this.args.filter.status = null;

    if (event.target.checked) {
      this.args.filter.status = TREAT_STATUS;
    }

    this.args.onFilterChange();
  }

  @action
  resetFilters() {
    this.args.filter.reset();
    this.besluitTypes = [];
    this.args.onFilterChange();
  }
}
