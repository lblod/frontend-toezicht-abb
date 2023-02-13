import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ToezichtInzendingenShowRoute extends Route {
  @service store;

  async model(params) {
    const submissions = await this.store.query('submission', {
      filter: {
        'inzending-voor-toezicht': {
          id: params.id,
        },
      },
    });
    return {
      id: params.id,
      submission: submissions.firstObject,
    };
  }

  afterModel(model) {
    if (model.submission) {
      this.transitionTo('supervision.submissions.show', model.submission);
    } else {
      this.transitionTo('route-not-found', `toezicht/inzendingen/${model.id}`);
    }
  }
}
