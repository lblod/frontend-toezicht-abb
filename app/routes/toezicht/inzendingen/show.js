import Route from '@ember/routing/route';

export default class ToezichtInzendingenShowRoute extends Route {

  async model(params) {

    const submissions = await this.store.query('submission', {
      filter: {
        "inzending-voor-toezicht": {
          id: params.id
        }
      }
    });
    const submission = submissions.firstObject;
    if(submission) {
      this.transitionTo('supervision.submissions.show', submission);
    } else {
      this.transitionTo('route-not-found');
    }
  }
}
