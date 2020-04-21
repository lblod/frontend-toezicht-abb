import Model, { attr, hasMany } from '@ember-data/model';

export const ADMINISTRATIVE_CLASSIFICATION = 'http://data.vlaanderen.be/id/conceptscheme/BestuurseenheidClassificatieCode';
export const DECISION_TYPE = 'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5';
export const REGULATION = 'http://lblod.data.gift/concept-schemes/c93ccd41-aee7-488f-86d3-038de890d05a';

export default class ConceptSchemeModel extends Model {
  @attr uri
  @hasMany('concept', { inverse: null }) concepts
  @hasMany('concept', { inverse: null }) topConcepts
}
