import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  router: service(),

  tagName: '',
  model: null,

  saveMelding() {
    const melding = this.model.melding;


  },

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    saveMelding() {
      this.saveMelding();
    }
  }
});
