import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class DateRange extends Component {
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
    this.args.onChangeFromValue(null);
    this.args.onChangeToValue(null);
  }

  @action
  initRangeFilter() {
    let initFromDate = null;
    let initToDate = null;

    if (this.initFromDate) {
      initFromDate = this.initFromDate.toDate().toISOString();
    } else {
      const yesterday = moment().subtract(1, 'day').startOf('day');
      initFromDate = yesterday.toDate().toISOString();
    }
    if (this.initToDate) {
      initToDate = this.initToDate.toDate().toISOString();
    } else {
      const today = moment().endOf('day');
      initToDate = today.toDate().toISOString();
    }

    this.fromValue = initFromDate;
    this.toValue = initToDate;
    this.args.onChangeFromValue(initFromDate);
    this.args.onChangeToValue(initToDate);
  }

  @action
  updateDate(varName, date) {
    const dateString = date.toISOString();
    if (varName == 'fromDate') {
      this.args.onChangeFromValue(dateString);
    } else {
      this.args.onChangeToValue(dateString);
    }
  }

  @action
  updateSelectedValues() {
    if (!this.args.fromValue && !this.args.toValue) {
      this.resetFilter();
    }
  }
}
