import { tracked } from '@glimmer/tracking';

export default class InzendingenFilter {
  @tracked bestuurseenheidIds
  @tracked classificatieIds
  @tracked marCodeIds
  @tracked provincieIds
  @tracked besluitTypeIds
  @tracked regulationTypeId
  @tracked sessionDateFrom
  @tracked sessionDateTo
  @tracked sentDateFrom
  @tracked sentDateTo
  @tracked statusUri
  @tracked dateOfEntryIntoForceFrom
  @tracked dateOfEntryIntoForceTo
  @tracked endDateFrom
  @tracked endDateTo

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach(key => this[key] = params[key]);
  }

  get keys() {
    return [
      'bestuurseenheidIds',
      'classificatieIds',
      'marCodeIds',
      'provincieIds',
      'besluitTypeIds',
      'regulationTypeId',
      'sessionDateFrom',
      'sessionDateTo',
      'sentDateFrom',
      'sentDateTo',
      'statusUri',
      'dateOfEntryIntoForceFrom',
      'dateOfEntryIntoForceTo',
      'endDateFrom',
      'endDateTo'
    ];
  }

  reset() {
    this.keys.forEach(key => this[key] = null);
  }
}
