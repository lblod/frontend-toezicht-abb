import Controller from '@ember/controller';

import { task } from 'ember-concurrency-decorators';
import {removeSourceData} from '../../../utils/filter-form-helpers';

export default class UserSearchQueriesIndexController extends Controller {
  page = 0;
  size = 10;
  sort = '-created'

  @task
  *delete(id) {
    yield removeSourceData(`/search-queries/${id}`)
    yield this.model.update();
  }
}
