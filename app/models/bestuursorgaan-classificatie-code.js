import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class BestuursorgaanClassificatieCode extends Model {
  @attr()
  uri;

  @attr()
  label;

  @attr()
  scopeNote;
}
