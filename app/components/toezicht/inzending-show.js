import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  tagName: '',
  model: null,

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    }
  }
});
