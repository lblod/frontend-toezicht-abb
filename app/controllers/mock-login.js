import Controller from '@ember/controller';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

export default class MockLoginController extends Controller {
  queryParams = ['gemeente', 'page'];
  gemeente = '';
  page = 0;
  size = 10;

  @task
  queryStore = function*() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente)
      filter.gebruiker = { 'achternaam': this.gemeente};
    const accounts = yield this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam'
    });
    return accounts;
  };

  @task({ restartable: true })
  updateSearch = function*(value) {
    yield timeout(500);
    this.page = 0;
    this.gemeente = value;
    const model = yield this.queryStore.perform();
    this.model = model;
  };
}
