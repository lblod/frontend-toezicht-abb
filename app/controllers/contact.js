import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import ENV from 'frontend-toezicht-abb/config/environment';

export default class ContactController extends Controller {
  constructor() {
    super(...arguments);
    this.footer = ENV['vo-webuniversum']['footer'];
  }
}
