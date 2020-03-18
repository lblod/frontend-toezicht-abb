import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';

export default class LoginController extends Controller {
  constructor() {
    super(...arguments);
    this.header = ENV['vo-webuniversum']['header'];
    this.footer = ENV['vo-webuniversum']['footer'];
  }
}
