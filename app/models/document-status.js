import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  label: attr(),

  isConcept: equal('uri', 'http://data.lblod.info/document-statuses/concept'),
  isVerstuurd: equal('uri', 'http://data.lblod.info/document-statuses/verstuurd')
});
