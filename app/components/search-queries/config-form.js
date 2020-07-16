import SearchQueriesFormComponent from './form';

import {task} from 'ember-concurrency-decorators';

const CONFIG_FORM_UUID = 'ebd65df9-5566-47c2-859a-ceff562881ab';

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super(CONFIG_FORM_UUID, owner, args);
  }

  async setupForm(form) {
    await super.setupForm(form);
    if(!this.isNewForm) {
      await this.retrieveSourceData(this.args.query);
    }
  }

  get isNewForm() {
    return !this.args.query ;
  }

  @task
  * save() {
    let query = this.args.query;
    if(!query) {
      const user = yield this.currentSession.user;
      query = this.store.createRecord('search-query', {
        user
      });
      yield query.save();
    }
    yield this.updateSourceData(query);
    this.router.transitionTo('user.search-queries')
  }

  @task
  * remove() {
    yield this.removeSourceData(this.args.query);
    this.router.transitionTo('user.search-queries')
  }
}
