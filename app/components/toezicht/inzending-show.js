import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
export default class InzendingShow extends Component {
  @service
  currentSession;

  model = null;

  @action
  noop() {}
}
