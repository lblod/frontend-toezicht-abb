import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";

import {action} from '@ember/object';

import {timeout} from 'ember-concurrency';
import {task, restartableTask} from "ember-concurrency-decorators";
import moment from 'moment';

import {DECISION_TYPE} from "../../models/concept-scheme";
import {TREAT_STATUS} from "../../models/submission-review-status";

export default class SubmissionsSearchTableComponent extends Component {

  @tracked decisionTypes = []
  @tracked _freeTextSearch;

  constructor() {
    super(...arguments);

    // This should only be set once.
    // After intial set, this component should remain master over what data gets displayed in
    // search box. Else you have race conditions, and flickering behaviour for user.
    if(!this._freeTextSearch){
      this._freeTextSearch = this.args.filter.search;
    }
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

  get nextYear() {
    return moment().add(1, 'year').startOf('day');
  }

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get regulationTypeIsSelected() {
    return this.decisionTypes.filterBy('isRegulation', true).length > 0;
  }

  get isStatusFilterEnabled() {
    return this.args.filter.status != null;
  }

  set isStatusFilterEnabled(value) {
    // TODO remove-function once WuSwitch isn't 2-way bounded anymore
    // This setter has no meaning because the status is correctly updated by the setToTreatStatus
    return this._blackhole = value;
  }

  @restartableTask
  *search() {
    yield timeout(500);
    this.args.filter.search = this._freeTextSearch;
    this.args.onFilterChange();
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
  selectAdministrativeUnitClassifications(units) {
    if (units.length <= 0) {
      this.args.filter.governingBodyClassifications = null;
      this.args.filter.administrativeUnitClassifications = null;
      this.args.onFilterChange();
    } else {
      this.args.setFilter('administrativeUnitClassifications', units);
    }
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
