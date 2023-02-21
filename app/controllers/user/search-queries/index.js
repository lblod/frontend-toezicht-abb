import Controller from '@ember/controller';
import { service } from '@ember/service';

import { task } from 'ember-concurrency';
import { removeSourceData } from '../../../utils/filter-form-helpers';

export default class UserSearchQueriesIndexController extends Controller {
  @service router;

  page = 0;
  size = 10;
  sort = '-created';

  @task
  *delete(id) {
    // TODO: The backend needs to be updated so Ember Data's `record.destroyRecord()` method works and we don't need the route refreshing code anymore
    yield removeSourceData(`/search-queries/${id}`);
    this.router.refresh('user.search-queries.index');
  }
}
