import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['js-accordion', 'js-accordion--open'],
  label: 'Periode verstuurd',

  _fromDate: null,  // date object
  _toDate: null,  // date object

  fromValue: null,  // ISO string
  toValue: null,  // ISO string

  isFilterEnabled: computed('fromValue', 'toValue', function() {
    return this.fromValue || this.toValue;
  }),

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.fromValue && !this._fromDate) {
      const date = new Date(Date.parse(this.fromValue));
      this.set('_fromDate', date);
    } else if (!this.fromValue) {
      this.set('_fromDate', null);
    }

    if (this.toValue && !this._toDate) {
      const date = new Date(Date.parse(this.toValue));
      this.set('_toDate', date);
    } else if (!this.toValue) {
      this.set('_toDate', null);
    }
  },

  fromDateChanged() {
    if (this._fromDate)
      this.set('fromValue', this._fromDate.toISOString());
  },

  toDateChanged() {
    if (this._toDate)
      this.set('toValue', this._toDate.toISOString());
  },

  actions: {
    resetFilter() {
      ['fromValue', 'toValue'].forEach(filter => this.set(filter, null));
    },
    initRangeFilter() {
      const yesterday = moment().subtract(1, 'day').startOf('day');
      const today = moment().endOf('day');
      this.set('_fromDate', yesterday.toDate());
      this.set('_toDate', today.toDate());
    }
  }
});
