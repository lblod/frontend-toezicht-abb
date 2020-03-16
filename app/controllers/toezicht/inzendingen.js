import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { bool } from '@ember/object/computed';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';
import moment from 'moment';

@classic
export default class InzendingenController extends Controller {
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
  _toTreatStatusUri = "http://data.lblod.info/melding-statuses/te-behandelen";

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  @bool('statusUri')
  isStatusFilterEnabled;

  @computed('router.currentRouteName')
  get hasActiveChildRoute() {
    return this.get('router.currentRouteName').startsWith('toezicht.inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.inzendingen.index';
  }

  init() {
    super.init(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
    this.besluitTypes = A();
  }

  @computed('besluitTypes.[]', 'besluitTypeIds')
  get regulationTypeIsSelected() {
    return this.besluitTypeIds ? this.besluitTypes.filterBy('isRegulation', true).length > 0 : false;
  }

  @action
  setToTreatStatus(event) {
    this.set('statusUri', null);
    if(event.target.checked) {
      this.set('statusUri', this._toTreatStatusUri);
    }
  }

  @action
  resetFilters() {
    //--- reset the filters
    ['bestuurseenheidIds',
     'classificatieIds',
     'provincieIds',
     'besluitTypeIds',
     'regulationTypeId',
     'sessionDateFrom',
     'sessionDateTo',
     'sentDateFrom',
     'sentDateTo',
     'statusUri'].forEach(filter => this.set(filter, null));
  }

  @action
  selectBesluitTypes(types) {
    this.set('besluitTypes', types);
    this.set('besluitTypeIds', types && types.map(d => d.get('id')));
    //--- Clear the regulationId property if none of the selected besluitTypes (if any) is a regulation.
    if (!this.besluitTypes.some(type => type.get('isRegulation')))
      this.set('regulationTypeId', null);
  }
}
