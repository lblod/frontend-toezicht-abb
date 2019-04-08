import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default Model.extend({
  label: attr(),
  decidableBy: hasMany('bestuurseenheid-classificatie-code', { inverse: null }),
  uri: attr(),

  isRegulation: computed('uri', function(){
    return this.uri === 'http://data.lblod.info/DecisionType/5b3955cc006323233e711c482f3a6bf39a8d3eba6bbdb2c672bdfcf2b2985b03';
  })
});
