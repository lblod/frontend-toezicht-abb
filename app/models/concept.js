import Model, { attr, hasMany } from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr uri
  @attr label
  @hasMany("concept-scheme", { inverse: null }) conceptSchemes
  @hasMany("concept-scheme", { inverse: null }) topConceptSchemes

  get isRegulation() {
    return this.uri === 'https://data.vlaanderen.be/id/concept/BesluitType/67378dd0-5413-474b-8996-d992ef81637a';
  }
}
