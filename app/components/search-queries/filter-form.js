import SearchQueriesFormComponent from './form';
import rdflib from 'browser-rdflib';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {task} from 'ember-concurrency-decorators';
import {FORM_GRAPHS, SEARCH, SH} from '../../utils/rdf-form';

export const FILTER_FORM_UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c';

const TEMP_SOURCE_NODE = new rdflib.NamedNode('http://frontend-toezicht-abb/temp-source-node');

export default class SearchQueriesFilterFormComponent extends SearchQueriesFormComponent {

  @tracked refreshing = false;

  constructor(owner, args) {
    super(FILTER_FORM_UUID, owner, args);
  }

  async loadData(form) {
    await super.loadData(form);
    this.sourceNode = TEMP_SOURCE_NODE;
    this.loadQueryParams();
    this.registerObserver();
    this.args.onFilterChange();
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
    const query = this.store.createRecord('search-query', {
      user
    });
    yield query.save();

    // NOTE: we need to update the local source data in the store with the created search-query
    yield this.retrieveSourceData(query);

    // NOTE: replace the temporary source-node with the uri of the saved query
    const updated = this.formStore
    .match(TEMP_SOURCE_NODE, undefined, undefined, FORM_GRAPHS.sourceGraph)
    .map(t => {
      t.subject = this.sourceNode;
      return t;
    });

    if (updated.length) {
      // NOTE: for some reason removeMatches() does not call the observers (pretty ok with that in this use case)
      this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined, FORM_GRAPHS.sourceGraph);
      this.formStore.addAll(updated);
    }

    yield this.saveSourceData(query);

    this.router.transitionTo('user.search-queries.edit', query);
  }

  // TODO improve as this is a little hackish
  // NOTE: the problem here lies in that if an outsider makes changes in the store,
  // the field components are not aware of this. There for, for now, we force the form to rerender by temporarily
  // changing the "show" argument.
  @action
  resetFilters() {
    this.refreshing = true;
    this.args.filter.reset();
    this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined, FORM_GRAPHS.sourceGraph);
    this.args.onFilterChange();
    setTimeout(() => {
      this.refreshing = false;
    }, 1);
  }

  // INTERNAL LOGIC

  /**
   * Registers the necessary observer to allow the filter to work on change of the form-store.
   */
  registerObserver() {
    this.formStore.registerObserver(({inserts = [], deletes = []}) => {
      this.updateQueryParams([...inserts, ...deletes]);
      this.args.onFilterChange();
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

  /**
   * Will update the query-parameters based on the given triples.
   *
   * @param triples
   */
  updateQueryParams(triples) {
    triples.forEach(t => {
      // NOTE: we need to retrieve the value because on deletion we get the deleted value, not the actual new value
      const values = this.formStore
      .match(t.subject, t.predicate, undefined, FORM_GRAPHS.sourceGraph)
      .map(t => t.object.value);
      const field = this.formStore.any(undefined, SH('path'), t.predicate, FORM_GRAPHS.formGraph);
      const key = this.formStore.any(field, SEARCH('key'), undefined, FORM_GRAPHS.formGraph);
      if (key) {
        this.args.filter[key.value] = values ? values.join(',') : null;
      }
    });
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
