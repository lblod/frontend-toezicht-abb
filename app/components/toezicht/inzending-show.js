import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
@tagName('')
export default class InzendingShow extends Component {
  @service
  currentSession;

  model = null;

  @action
  noop() {}
}
