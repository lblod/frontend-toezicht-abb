import Model, { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  label: attr(),

  meldingen: hasMany('inzending-voor-toezicht-melding', { inverse: null }),

  isAfgehandeld: equal('uri', 'http://data.lblod.info/melding-statuses/afgehandeld'),
  isTeBehandelen: equal('uri', 'http://data.lblod.info/melding-statuses/te-behandelen')
});
