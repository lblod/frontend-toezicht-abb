import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import moment from 'moment';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';

@classic
export default class VlabelInzendingenController extends Controller {
  @service
  router;

  @service
  store;

  @service
  currentSession;

  page = 0;
  size = 20;
  besluitTypes = null;
  sort = '-sent-date';

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get nextYear() {
    return moment().add(1, 'year').startOf('day');
  }

  @computed('router.currentRouteName')
  get hasActiveChildRoute() {
    return this.get('router.currentRouteName').startsWith('toezicht.vlabel-inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.vlabel-inzendingen.index';
  }

  init() {
    super.init(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.besluitTypes = A();
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
