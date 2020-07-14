import SearchQueriesFormComponent from './form';

import {task} from 'ember-concurrency-decorators';

const CONFIG_FORM_UUID = 'ebd65df9-5566-47c2-859a-ceff562881ab';

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super(CONFIG_FORM_UUID, owner, args);
  }

  async loadData(form) {
    await super.loadData(form);
    await this.retrieveSourceData(this.args.query);
  }

  @task
  * save() {
    yield this.saveSourceData(this.args.query);
    this.router.transitionTo('user.search-queries')
  }

  @task
  * remove() {
    yield this.removeSourceData(this.args.query);
    this.router.transitionTo('user.search-queries')
  }
}
