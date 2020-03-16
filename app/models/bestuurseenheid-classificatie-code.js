import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class BestuurseenheidClassificatieCode extends Model {
  @attr()
  label;

  @attr()
  scopeNote;

  @attr()
  uri;
}
