import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { equal } from '@ember/object/computed';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  label: attr(),

  meldingen: hasMany('inzending-voor-toezicht-melding', { inverse: 'status' }),

  isAfgehandeld: equal('uri', 'http://data.lblod.info/melding-statuses/afgehandeld'),
  isTeBehandelen: equal('uri', 'http://data.lblod.info/melding-statuses/te-behandelen')
});
