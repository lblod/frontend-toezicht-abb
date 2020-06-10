import Component from '@glimmer/component';
import moment from 'moment';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {task} from 'ember-concurrency-decorators';
import {inject as service} from '@ember/service';
import InzendingenFilter from '../../utils/inzendingen-filter';
import {DECISION_TYPE} from "../../models/concept-scheme";
import {TREAT_STATUS} from "../../models/submission-review-status";
import { typeOf } from '@ember/utils';

export default class SubmissionRegularTableComponent extends Component {
  @service store

  @tracked besluitTypes = []
  @tracked filter

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
    this.loadData.perform();
  }

  @task
  * loadData() {
    if (this.filter.besluitTypeIds) {
      this.besluitTypes = yield this.store.query('concept', {
        filter: {
          id: this.filter.besluitTypeIds,
          "concept-schemes": {
            ":uri:": DECISION_TYPE
          }
        },
        page: {size: this.filter.besluitTypeIds.split(',').length}
      });
    }
  }

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get regulationTypeIsSelected() {
    return this.besluitTypes.filterBy('isRegulation', true).length > 0;
  }

  get isStatusFilterEnabled() {
    return this.filter.statusUri != null;
  }

  set isStatusFilterEnabled(value) {
    // TODO remove-function once WuSwitch isn't 2-way bounded anymore
    // This setter has no meaning because the status is correctly updated by the setToTreatStatus
    return this._blackhole = value;
  }

  @action
  setFilter(key, value) {
    if (typeOf(value) == 'array')
      this.filter[key] = value.join(',');
    else
      this.filter[key] = value;
    this.args.onFilterChange(this.filter);
  }

  @action
  setToTreatStatus(event) {
    this.filter.statusUri = null;

    if (event.target.checked) {
      this.filter.statusUri = TREAT_STATUS;
    }

    this.args.onFilterChange(this.filter);
  }

  @action
  selectBesluitTypes(types) {
    this.besluitTypes = types;
    this.filter.besluitTypeIds = types && types.map(d => d.id);

    if (!this.besluitTypes.find(type => type.isRegulation))
      this.filter.regulationTypeIds = null;

    this.args.onFilterChange(this.filter);
  }

  @action
  selectAdministrativeUnitClassifications(units) {
    if (units && units.length <= 0) {
      this.filter.governingBodyClassificationIds = null;
      this.filter.classificatieIds = null;
      this.args.onFilterChange(this.filter);
    } else {
      this.setFilter('classificatieIds', units);
    }
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.besluitTypes = [];
    this.args.onFilterChange(this.filter);
  }
}
