import Controller from '@ember/controller';
import { timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';

export default class MockLoginController extends Controller {
  constructor() {
    super(...arguments);
  }

  queryParams = ['gemeente', 'page'];
  gemeente = '';
  page = 0;
  size = 10;

  @task
  *queryStore() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente)
      filter.gebruiker = { 'achternaam': this.gemeente };
    const accounts = yield this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam'
    });
    return accounts;
  }

  @restartableTask
  *updateSearch(value) {
    yield timeout(500);
    this.page = 0;
    this.gemeente = value;
    const model = yield this.queryStore.perform();
    this.model = model;
  }
}
