import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('footer', ENV['vo-webuniversum']['footer']);
  }
});
