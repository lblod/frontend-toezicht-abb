import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';
import ENV from 'frontend-toezicht-abb/config/environment';

export default class AppSessionService extends SessionService {
  @service currentSession;

  async handleAuthentication(routeAfterAuthentication) {
    await this.currentSession.load();
    super.handleAuthentication(routeAfterAuthentication);
  }

  handleInvalidation(logoutUrl) {
    const acmidmLogoutUrl = ENV.acmidm.logoutUrl;
    if (acmidmLogoutUrl.startsWith('http')) {
      super.handleInvalidation(acmidmLogoutUrl);
    } else {
      super.handleInvalidation(logoutUrl);
    }
  }
}
