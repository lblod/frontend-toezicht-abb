import Route from '@ember/routing/route';

export default class SupervisionSubmissionsShowRoute extends Route {

  model(params) {
    return this.store.findRecord('submission', params.id, {
      include:[
        'organization.classificatie',
        'organization.provincie',
        'review.status',
        'form-data.types',
        'last-modifier',
      ].join(',')
    });
  }
}
