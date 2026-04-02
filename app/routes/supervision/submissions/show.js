import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { registerFormField } from 'frontend-toezicht-abb/components/submissions/fields/decision-articles-field';
import { registerFormField as registerDecisionDocumentsField } from 'frontend-toezicht-abb/components/submissions/fields/decision-documents-field';
import { registerFormField as registerDecisionRemoteDocumentsField } from 'frontend-toezicht-abb/components/submissions/fields/decision-remote-documents';

export default class SupervisionSubmissionsShowRoute extends Route {
  @service store;

  constructor() {
    super(...arguments);

    registerFormField();
    registerDecisionDocumentsField();
    registerDecisionRemoteDocumentsField();
  }

  model(params) {
    return this.store.findRecord('submission', params.id, {
      include: [
        'organization.classificatie',
        'review.status',
        'form-data.types',
        'last-modifier',
      ].join(','),
    });
  }
}
