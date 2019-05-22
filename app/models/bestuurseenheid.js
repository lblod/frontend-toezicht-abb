import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  naam: attr(),
  alternatieveNaam: attr('string-set'),
  werkingsgebied: belongsTo('werkingsgebied', { inverse: null }),
  provincie: belongsTo('werkingsgebied', { inverse: 'bestuurseenhedenInProvincie' }),
  classificatie: belongsTo('bestuurseenheid-classificatie-code', { inverse: null }),
  bestuursorganen: hasMany('bestuursorgaan', { inverse: 'bestuurseenheid' })
});
