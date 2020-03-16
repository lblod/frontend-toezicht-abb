import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import Component from '@ember/component';
import moment from 'moment';

@classic
@classNames('js-accordion', 'js-accordion--open')
export default class DateRange extends Component {
  fromValue = null;  // ISO string
  toValue = null;  // ISO string

  @computed('fromValue')
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

  @computed('toValue')
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

  @computed('fromValue', 'toValue')
  get isFilterEnabled() {
    return this.fromValue || this.toValue;
  }

  @action
  resetFilter() {
    this.onChangeFromValue(null);
    this.onChangeToValue(null);
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

    this.onChangeFromValue(initFromDate);
    this.onChangeToValue(initToDate);
  }

  @action
  updateDate(varName, date) {
    const dateString = date.toISOString();
    if (varName == 'fromDate') {
      this.onChangeFromValue(dateString);
    } else {
      this.onChangeToValue(dateString);
    }
  }
}
