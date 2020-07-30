import SearchQueriesFormComponent from './form';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { formStoreToQueryParams, queryParamsToFormStore } from '../../utils/filter-form-helpers';

export const FILTER_FORM_UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c';

export default class SearchQueriesFilterFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super(FILTER_FORM_UUID, owner, args);
  }

  async setupForm(form) {
    await super.setupForm(form);
    this.loadQueryParams();
    this.registerObserver();
  }

  willDestroy() {
    this.formStore.deregisterObserver(FILTER_FORM_UUID);
  }

  // USER ACTIONS

  @action
  loadFilters() {
    this.router.transitionTo('user.search-queries');
  }

  @task
  * saveFilter() {
    yield this.router.transitionTo('user.search-queries.new', formStoreToQueryParams(this.formStore, this.sourceNode));
  }

  // NOTE: the problem here lies in that if an outsider makes changes in the store,
  // the field components are not aware of this. There for, for now, we force the form to rerender by temporarily
  // changing the "show" argument.
  @task
  * resetFilters() {
    yield super.setupForm(FILTER_FORM_UUID);
    this.updateQueryParams();
    this.registerObserver();
  }

  // INTERNAL LOGIC

  /**
   * Registers the necessary observer to allow the filter to work on change of the form-store.
   */
  registerObserver() {
    this.formStore.registerObserver(() => {
      this.updateQueryParams();
    }, FILTER_FORM_UUID);
  }

  /**
   * Will populate the form-store with the given query-parameters.
   */
  loadQueryParams() {
    queryParamsToFormStore(this.args.queryParams, this.formStore, this.sourceNode);
  }

  updateQueryParams() {
    // TODO: maybe try improving this based on the received changes?
    const query = formStoreToQueryParams(this.formStore, this.sourceNode);
    this.router.transitionTo(query);
  }
}
