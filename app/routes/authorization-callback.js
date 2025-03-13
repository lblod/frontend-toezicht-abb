import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthorizationCallbackRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  model(params) {
    return this.session.authenticate('authenticator:acm-idm', params.code);
  }
}
