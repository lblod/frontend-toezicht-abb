import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class Werkingsgebied extends Model {
  @computed('niveau', 'naam')
  get longName() {
    let niveau = this.niveau;
    let naam = this.naam;
    return `${naam} (${niveau})`;
  }

  @attr()
  uri;

  @attr()
  naam;

  @attr()
  niveau;

  @hasMany('bestuurseenheid', { inverse: null })
  bestuurseenheid;

  @hasMany('bestuurseenheid', { inverse: null })
  bestuurseenhedenInProvincie;
}
