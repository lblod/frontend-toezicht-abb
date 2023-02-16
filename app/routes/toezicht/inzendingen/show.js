import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ToezichtInzendingenShowRoute extends Route {
  @service store;
  @service router;

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
      submission: submissions[0],
    };
  }

  afterModel(model) {
    if (model.submission) {
      this.router.transitionTo(
        'supervision.submissions.show',
        model.submission
      );
    } else {
      this.router.transitionTo(
        'route-not-found',
        `toezicht/inzendingen/${model.id}`
      );
    }
  }
}
