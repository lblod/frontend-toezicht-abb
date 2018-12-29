import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  currentSession: service(),

  beforeModel() {
    return this._loadCurrentSession();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentSession();
  },

  _loadCurrentSession() {
    return this.currentSession.load().catch(() => this.session.invalidate());
  }
});
