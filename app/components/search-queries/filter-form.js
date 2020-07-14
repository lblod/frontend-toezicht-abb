import SearchQueriesFormComponent from './form';
import rdflib from 'browser-rdflib';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {task} from 'ember-concurrency-decorators';
import {FORM_GRAPHS, formStoreToQueryParams, SEARCH, SH} from '../../utils/rdf-form';

export const FILTER_FORM_UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c';

export default class SearchQueriesFilterFormComponent extends SearchQueriesFormComponent {

  @tracked refreshing = false;

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
    const user = yield this.currentSession.user;
    const query = this.store.createRecord('search-query', {user});
    yield query.save();
    yield this.updateSourceData(query);
    this.router.transitionTo('user.search-queries.edit', query);
  }

  // NOTE: the problem here lies in that if an outsider makes changes in the store,
  // the field components are not aware of this. There for, for now, we force the form to rerender by temporarily
  // changing the "show" argument.
  @task
  * resetFilters() {
    yield  super.setupForm(FILTER_FORM_UUID);
    this.updateQueryParams();
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
    this.args.filter.keys.forEach(key => {
      const field = this.formStore.any(undefined, SEARCH('key'), key, FORM_GRAPHS.formGraph);
      const path = this.formStore.any(field, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = this.args.filter[key] && this.args.filter[key].split(',');
      values && values.forEach(v => this.formStore.graph.add(
        this.sourceNode,
        path,
        this.validURL(v) ? new rdflib.NamedNode(v) : v, FORM_GRAPHS.sourceGraph));
    });
  }

  updateQueryParams() {
    // TODO: maybe try improving this based on the received changes?
    this.router.transitionTo(formStoreToQueryParams(this.formStore, this.sourceNode));
  }

  // TODO simplify
  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }
}
