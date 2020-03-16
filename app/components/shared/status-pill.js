import classic from 'ember-classic-decorator';
import { classNames, attributeBindings, tagName } from '@ember-decorators/component';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@tagName('label')
@classNames('pill')
@attributeBindings('resource')
class StatusPillComponent extends Component {
  status = null;

  @alias('status.uri')
  resource;
}

StatusPillComponent.reopenClass({
  positionalParams: ['status']
});

export default StatusPillComponent;
