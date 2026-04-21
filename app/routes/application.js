import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { registerFormField as registerDecisionArticlesField } from 'frontend-toezicht-abb/components/submissions/fields/decision-articles-field';
import { registerFormField as registerDecisionDocumentsField } from 'frontend-toezicht-abb/components/submissions/fields/decision-documents-field';
import { registerFormField as registerDecisionRemoteDocumentsField } from 'frontend-toezicht-abb/components/submissions/fields/decision-remote-documents';

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service session;

  async beforeModel() {
    await this.session.setup();
    await this._loadCurrentSession();
    this.registerFormFields();
  }

  async _loadCurrentSession() {
    try {
      await this.currentSession.load();
    } catch (error) {
      this.session.invalidate();
    }
  }

  registerFormFields() {
    registerDecisionArticlesField();
    registerDecisionDocumentsField();
    registerDecisionRemoteDocumentsField();
  }
}
