import Route from '@ember/routing/route';

export default class SupervisionSubmissionsShowRoute extends Route {

  model(params) {
    return this.store.find('submission', params.id);
  }
}
