import {tracked} from '@glimmer/tracking';

export default class SubmissionFilter {
  @tracked administrativeUnites
  @tracked administrativeUnitClassifications
  @tracked chartOfAccounts
  @tracked provinces
  @tracked decisionTypes
  @tracked regulationTypes
  @tracked sessionDateFrom
  @tracked sessionDateTo
  @tracked sentDateFrom
  @tracked sentDateTo
  @tracked search
  @tracked status
  @tracked dateOfEntryIntoForceFrom
  @tracked dateOfEntryIntoForceTo
  @tracked dateNoLongerInForceFrom
  @tracked dateNoLongerInForceTo

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach(key => this[key] = params[key]);
  }

  get keys() {
    return [
      'administrativeUnites',
      'administrativeUnitClassifications',
      'chartOfAccounts',
      'provinces',
      'decisionTypes',
      'regulationTypes',
      'sessionDateFrom',
      'sessionDateTo',
      'sentDateFrom',
      'sentDateTo',
      'search',
      'status',
      'dateOfEntryIntoForceFrom',
      'dateOfEntryIntoForceTo',
      'dateNoLongerInForceFrom',
      'dateNoLongerInForceTo'
    ];
  }

  reset() {
    this.keys.forEach(key => this[key] = null);
  }
}
