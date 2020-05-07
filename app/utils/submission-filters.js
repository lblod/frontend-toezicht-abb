import {tracked} from '@glimmer/tracking';

export default class SubmissionFilter {
  @tracked administrativeUnites
  @tracked administrativeUnitClassifications
  // TODO vlabel search?
  //  @tracked chartOfAccounts
  @tracked provinces
  @tracked decisionTypes
  @tracked regulationTypes
  @tracked sessionDateFrom
  @tracked sessionDateTo
  @tracked sentDateFrom
  @tracked sentDateTo
  @tracked search
  @tracked status
  // TODO vlabel search?
  //  @tracked dateOfEntryIntoForceFrom
  //  @tracked dateOfEntryIntoForceTo
  //  @tracked endDateFrom
  //  @tracked endDateTo

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach(key => this[key] = params[key]);
  }

  get keys() {
    return [
      'administrativeUnites',
      'administrativeUnitClassifications',
      'provinces',
      'decisionTypes',
      'regulationTypes',
      'sessionDateFrom',
      'sessionDateTo',
      'sentDateFrom',
      'sentDateTo',
      'search',
      'status'
    ];
  }

  reset() {
    this.keys.forEach(key => this[key] = null);
  }
}
