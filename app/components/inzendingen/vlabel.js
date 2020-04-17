import Component from '@glimmer/component';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import InzendingenFilter from '../../utils/inzendingen-filter';

export default class InzendingenVlabelComponent extends Component {
  @service store

  @tracked filter

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
  }

  get nextYear() {
    return moment().add(1, 'year').startOf('day');
  }

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  @action
  setFilter(key, value) {
    this.filter[key] = value;
    this.args.onFilterChange(this.filter);
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.args.onFilterChange(this.filter);
  }
}
