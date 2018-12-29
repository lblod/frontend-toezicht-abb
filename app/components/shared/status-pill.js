import { alias } from '@ember/object/computed';
import Component from '@ember/component';

const StatusPillComponent = Component.extend({
  tagName: 'label',
  classNames: ['pill'],
  attributeBindings: ['resource'],
  status: null,
  resource: alias('status.uri')
});

StatusPillComponent.reopenClass({
  positionalParams: ['status']
});

export default StatusPillComponent;
