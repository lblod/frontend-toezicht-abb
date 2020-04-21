import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class FilterDateRangeComponent extends Component {
  @tracked fromValue = null;  // ISO string
  @tracked toValue = null;  // ISO string

  get fromDate() {
    if (this._fromDate) {
      return this._fromDate;
    }
    try {
      return new Date(Date.parse(this.fromValue));
    } catch(e) {
      return null;
    }
  }

  set fromDate(value) {
    return this._fromDate = value;
  }

  get toDate() {
    if (this._toValue) {
      return this._toValue;
    }
    try {
      return new Date(Date.parse(this.toValue));
    } catch(e) {
      return null;
    }
  }

  set toDate(value) {
    return this._toValue = value;
  }

  get isFilterEnabled() {
    return this.fromValue || this.toValue;
  }

  constructor() {
    super(...arguments);
    this.fromValue = this.args.fromValue;
    this.toValue = this.args.toValue;
  }

  @action
  resetFilter() {
    this.fromValue = null;
    this.toValue = null;
    this.args.onChangeFromValue(this.fromValue);
    this.args.onChangeToValue(this.toValue);
  }

  @action
  initRangeFilter() {
    let initFromValue = null;
    let initToValue = null;

    if (this.args.defaultFromDate) {
      initFromValue = this.args.defaultFromDate.toDate().toISOString();
    } else {
      const yesterday = moment().subtract(1, 'day').startOf('day');
      initFromValue = yesterday.toDate().toISOString();
    }

    if (this.args.defaultToDate) {
      initToValue = this.args.defaultToDate.toDate().toISOString();
    } else {
      const today = moment().endOf('day');
      initToValue = today.toDate().toISOString();
    }

    this.fromValue = initFromValue;
    this.toValue = initToValue;
    this.args.onChangeFromValue(this.fromValue);
    this.args.onChangeToValue(this.toValue);
  }

  @action
  updateDate(varName, date) {
    const dateString = date.toISOString();
    if (varName == 'fromDate') {
      this.fromValue = dateString;
      this.args.onChangeFromValue(dateString);
    } else {
      this.toValue = dateString;
      this.args.onChangeToValue(dateString);
    }
  }

  @action
  updateSelectedValues() {
    if (!this.args.fromValue && !this.args.toValue) {
      // Filters have been reset from outside the compenent.
      // so we need to reset the internal state
      this.fromValue = null;
      this.toValue = null;
      this.fromDate = null;
      this.toDate = null;
    }
  }
}
