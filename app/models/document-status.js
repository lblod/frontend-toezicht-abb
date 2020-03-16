import classic from 'ember-classic-decorator';
import { equal } from '@ember/object/computed';
import Model, { attr } from '@ember-data/model';

@classic
export default class DocumentStatus extends Model {
  @attr()
  uri;

  @attr()
  label;

  @equal('uri', 'http://data.lblod.info/document-statuses/concept')
  isConcept;

  @equal('uri', 'http://data.lblod.info/document-statuses/verstuurd')
  isVerstuurd;
}
