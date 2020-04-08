import Component from '@glimmer/component';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { TO_TREAT_STATUS } from '../../models/melding-status';
import InzendingenFilter from '../../utils/inzendingen-filter';

export default class InzendingenRegularComponent extends Component {
  @service store

  @tracked besluitTypes = []
  @tracked filter

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
    this.loadData.perform();
  }

  @task
  *loadData() {
    if (this.filter.besluitTypeIds) {
      this.besluitTypes = yield this.store.query('besluit-type', {
        filter: { id: this.filter.besluitTypeIds },
        page: { size: this.filter.besluitTypeIds.split(',').length}
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
    return this._blackhole = value;
  }

  @action
  setFilter(key, value) {
    this.filter[key] = value;
    this.args.onFilterChange(this.filter);
  }

  @action
  setToTreatStatus(event) {
    this.filter.statusUri = null;

    if (event.target.checked) {
      this.filter.statusUri = TO_TREAT_STATUS;
    }

    this.args.onFilterChange(this.filter);
  }

  @action
  selectBesluitTypes(types) {
    this.besluitTypes = types;
    this.filter.besluitTypeIds = types && types.map(d => d.id);

    if (!this.besluitTypes.find(type => type.isRegulation))
      this.filter.regulationTypeId = null;

    this.args.onFilterChange(this.filter);
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.args.onFilterChange(this.filter);
  }
}
