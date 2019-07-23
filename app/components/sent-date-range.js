import Component from '@ember/component';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['js-accordion', 'js-accordion--open'],
  label: 'Periode verstuurd',

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
      const yesterday = moment().subtract(1, 'day').startOf('day');
      const today = moment().endOf('day');
      this.onChangeFromValue(yesterday.toDate().toISOString());
      this.onChangeToValue(today.toDate().toISOString());
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
