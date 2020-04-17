import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class InzendingShow extends Component {
  @service currentSession;

  @action
  noop() {}
}
