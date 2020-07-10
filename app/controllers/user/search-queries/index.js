import Controller from '@ember/controller';

import fetch from 'node-fetch';

import { task } from 'ember-concurrency-decorators';

export default class UserSearchQueriesIndexController extends Controller {
  page = 0;
  size = 5;

  @task
  *delete(id) {
    yield fetch(`/search-queries/${id}`, {
      method: 'DELETE',
    });
    yield this.model.update();
  }
}
