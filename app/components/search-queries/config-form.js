import SearchQueriesFormComponent from './form';

import { task } from 'ember-concurrency-decorators';
import { queryParamsToFormStore } from '../../utils/filter-form-helpers';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { FILTER_FORM_UUID } from './filter-form';

const CONFIG_FORM_UUID = 'ebd65df9-5566-47c2-859a-ceff562881ab';

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  @tracked
  isFormEmpty;

  constructor(owner, args) {
    super(CONFIG_FORM_UUID, owner, args);
  }

  async setupForm(form) {
    await super.setupForm(form);
    if (this.isNewForm) {
      this.loadQueryParams();
    } else {
      await this.retrieveSourceData(this.args.query);
    }
    this.registerObserver();
  }

  willDestroy() {
    this.formStore.deregisterObserver(FILTER_FORM_UUID);
  }

  get isNewForm() {
    return !this.args.query;
  }

  // External logic (user input)

  @task
  * save() {
    let query = this.args.query;
    if (!query) {
      const user = yield this.currentSession.user;
      query = this.store.createRecord('search-query', {
        user,
      });
      yield query.save();
    }
    yield this.updateSourceData(query);
    this.router.transitionTo('user.search-queries');
  }

  @task
  * remove() {
    yield this.removeSourceData(this.args.query);
    this.router.transitionTo('user.search-queries');
  }

  @action
  back() {
    this.router.location.history.back();
  }

  // INTERNAL LOGIC

  /**
   * Will populate the form-store with the given query-parameters.
   */
  loadQueryParams() {
    queryParamsToFormStore(this.args.queryParams, this.formStore, this.sourceNode);
  }

  /**
   * Registers the necessary observer to allow the filter to work on change of the form-store.
   */
  registerObserver() {
    this.updateIsEmptyForm();
    this.formStore.registerObserver(() => {
        this.updateIsEmptyForm();
    }, FILTER_FORM_UUID);
  }

  updateIsEmptyForm() {
    this.isFormEmpty = !(this.formStore && this.formStore.match(
      this.sourceNode,
      undefined,
      undefined,
      this.graphs.sourceGraph).length);
  }
}
