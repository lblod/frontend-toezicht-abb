import Route from '@ember/routing/route';

export default class SupervisionSubmissionsShowRoute extends Route {

  async model(params) {
    return await this.store.find('submission', params.id);
  }
}
