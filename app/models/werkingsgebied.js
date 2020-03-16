import Model, { attr, hasMany } from '@ember-data/model';
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
