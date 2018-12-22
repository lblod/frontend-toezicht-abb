import Model from 'ember-data/model';
import { computed } from '@ember/object';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  voornaam: attr(),
  achternaam: attr(),
  bestuurseenheden: hasMany('bestuurseenheid'),
  group: computed('bestuurseenheden', function () {
    return this.get('bestuurseenheden.firstObject');
  }),
  fullName: computed('voornaam', 'achternaam', function() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  })
});
