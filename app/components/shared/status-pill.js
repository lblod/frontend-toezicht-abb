import classic from 'ember-classic-decorator';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

@classic
class StatusPillComponent extends Component {
  status = null;

  @alias('status.uri')
  resource;
}

StatusPillComponent.reopenClass({
  positionalParams: ['status']
});

export default StatusPillComponent;
