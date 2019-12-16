import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'frontend-toezicht-abb/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  currentSession: service(),

  beforeModel() {
    return this._loadCurrentSession();
  },

  async sessionAuthenticated() {
    this._super(...arguments);
    await this._loadCurrentSession();
  },

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    window.location.replace(logoutUrl);
  },

  _loadCurrentSession() {
    return this.currentSession.load().catch(() => this.session.invalidate());
  }
});
