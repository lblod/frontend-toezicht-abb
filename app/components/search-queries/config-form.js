import SearchQueriesFormComponent from './form';

import { task } from 'ember-concurrency-decorators';
import { queryParamsToFormStore } from '../../utils/filter-form-helpers';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { FILTER_FORM_UUID } from './filter-form';

const CONFIG_FORM_UUID = 'ebd65df9-5566-47c2-859a-ceff562881ab';

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  @tracked isFormEmpty;

  @tracked error;

  constructor(owner, args) {
    super(CONFIG_FORM_UUID, owner, args);
  }

  get isNewForm() {
    return !this.args.query;
  }

  // Setup and destroy

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

  // External logic (user input)

  @task
  * save() {
    try {
      yield this.saveSourceData(this.args.query);
      this.router.transitionTo('user.search-queries');
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e.stack);
    }
  }

  @task
  * remove() {
    try {
      yield this.removeSourceData(this.args.query);
      this.router.transitionTo('user.search-queries');
    } catch (e) {
      this.error = e;
      // eslint-disable-next-line no-console
      console.error(e.stack);
    }
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
