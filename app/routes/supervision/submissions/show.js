import Route from '@ember/routing/route';

export default class SupervisionSubmissionsShowRoute extends Route {

  async model(params) {
    const submissions = await this.store.query('submission', {
      filter: {
        id: params.id
      },
      include: [
        'organization.classificatie',
        'organization.provincie',
        'status',
        'form-data.types',
        'last-modifier',
      ].join(',')
    });
    return submissions.firstObject;
  }
}
