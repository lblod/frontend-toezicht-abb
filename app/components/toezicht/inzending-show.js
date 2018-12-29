import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  model: null,
  canEdit: true, // TODO get role from current session

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    }
  }
});
