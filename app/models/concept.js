import Model, { attr, hasMany } from '@ember-data/model';

export const VLABEL_TYPE = 'https://data.vlaanderen.be/id/concept/BesluitType/efa4ec5a-b006-453f-985f-f986ebae11bc';

export default class ConceptModel extends Model {
  @attr uri
  @attr label
  @attr notation
  @attr searchLabel

  @hasMany("concept-scheme", { inverse: null }) conceptSchemes
  @hasMany("concept-scheme", { inverse: null }) topConceptSchemes

  get isRegulation() {
    return this.uri === 'https://data.vlaanderen.be/id/concept/BesluitType/67378dd0-5413-474b-8996-d992ef81637a';
  }

}
