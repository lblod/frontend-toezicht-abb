import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import moment from 'moment';
import ENV from 'frontend-toezicht-abb/config/environment';

export default class VlabelInzendingenController extends Controller {
  @service router;
  @service store;
  @service currentSession;

  page = 0;
  size = 20;
  sort = '-sent-date';

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get nextYear() {
    return moment().add(1, 'year').startOf('day');
  }

  get hasActiveChildRoute() {
    return this.router.currentRouteName.startsWith('toezicht.vlabel-inzendingen')
      && this.router.currentRouteName != 'toezicht.vlabel-inzendingen.index';
  }

  constructor() {
    super(...arguments);
    this.header = ENV['vo-webuniversum']['header'];
  }

  @action
  resetFilters() {
    //--- reset the filters
    ['bestuurseenheidIds',
     'marCodeIds',
     'sessionDateFrom',
     'sessionDateTo',
     'sentDateFrom',
     'sentDateTo',
     'dateOfEntryIntoForceFrom',
     'dateOfEntryIntoForceTo',
     'endDateFrom',
     'endDateTo'].forEach(filter => this.set(filter, null));
  }
}
