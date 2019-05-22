import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
  longName: computed('niveau', 'naam', function(){
    let niveau = this.niveau;
    let naam = this.naam;
    return `${naam} (${niveau})`;
  }),

  uri: attr(),
  naam: attr(),
  niveau: attr(),
  bestuurseenheid: hasMany('bestuurseenheid', { inverse: null }),
  bestuurseenhedenInProvincie: hasMany('bestuurseenheid', { inverse: null })
});
