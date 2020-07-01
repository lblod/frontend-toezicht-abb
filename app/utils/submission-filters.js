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
  // TODO: create getter for this to return an UUID based on true or false
  @tracked status
  @tracked governingBodyClassifications
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
      'governingBodyClassifications',
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
