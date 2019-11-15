import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['js-accordion', 'js-accordion--open'],

  fromValue: null,  // ISO string
  toValue: null,  // ISO string

  fromDate: computed('fromValue', function() {
    try {
      return new Date(Date.parse(this.fromValue));
    } catch(e) {
      return null;
    }
  }),

  toDate: computed('toValue', function() {
    try {
      return new Date(Date.parse(this.toValue));
    } catch(e) {
      return null;
    }
  }),

  isFilterEnabled: computed('fromValue', 'toValue', function() {
    return this.fromValue || this.toValue;
  }),

  actions: {
    resetFilter() {
      this.onChangeFromValue(null);
      this.onChangeToValue(null);
    },

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
    },

    updateDate(varName, date) {
      const dateString = date.toISOString();
      if (varName == 'fromDate') {
        this.onChangeFromValue(dateString);
      } else {
        this.onChangeToValue(dateString);
      }
    }
  }
});
