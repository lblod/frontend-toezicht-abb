import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';
import { A }  from '@ember/array';
import moment from 'moment';
import { bool } from '@ember/object/computed';

export default class InzendingenController extends Controller {
  @service router;
  @service store;
  @service currentSession;

  @tracked statusUri;
  @tracked isStatusFilterEnabled;
  @tracked besluitTypeIds;
  @tracked besluitTypes;

  page = 0;
  size = 20;
  sort = '-sent-date';
  _toTreatStatusUri = "http://data.lblod.info/melding-statuses/te-behandelen";

  @bool('statusUri') isStatusFilterEnabled;

  get hasActiveChildRoute() {
    return this.router.currentRouteName.startsWith('toezicht.inzendingen')
      && this.router.currentRouteName != 'toezicht.inzendingen.index';
  }

  get lastMonth() {
    return moment().subtract(1, 'month').startOf('day');
  }

  get regulationTypeIsSelected() {
    return this.besluitTypeIds ? this.besluitTypes.filterBy('isRegulation', true).length > 0 : false;
  }

  constructor() {
    super(...arguments);
    this.header = ENV['vo-webuniversum']['header'];
    this.besluitTypes = A();
  }

  @action
  setToTreatStatus(event) {
    this.statusUri = null;
    if(event.target.checked) {
      this.statusUri = this._toTreatStatusUri;
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
    this.besluitTypes = types;
    this.besluitTypeIds = types && types.map(d => d.id);
    //--- Clear the regulationId property if none of the selected besluitTypes (if any) is a regulation.
    if (!this.besluitTypes.some(type => type.isRegulation))
      this.regulationTypeId = null;
  }

  @action
  updateBesluitTypes(types) {
    this.besluitTypes = types;
  }
}
