import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service session;

  async beforeModel() {
    await this.session.setup();
    await this._loadCurrentSession();
  }

  async _loadCurrentSession() {
    try {
      await this.currentSession.load();
    } catch (error) {
      this.session.invalidate();
    }
  }
}
