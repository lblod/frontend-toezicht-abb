import Model, { attr, hasMany } from '@ember-data/model';

export default class BesluitType extends Model {
  @attr uri
  @attr label

  @hasMany('bestuurseenheid-classificatie-code', { inverse: null }) decidableBy

  get isRegulation() {
    return this.uri == 'http://data.lblod.info/DecisionType/5b3955cc006323233e711c482f3a6bf39a8d3eba6bbdb2c672bdfcf2b2985b03';
  }
}
