import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';

@classic
export default class ContactController extends Controller {
  init() {
    super.init(...arguments);
    this.set('footer', ENV['vo-webuniversum']['footer']);
  }
}
