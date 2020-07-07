import SearchQueriesFormComponent from "./form";
import rdflib from 'browser-rdflib';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';
import {task} from "ember-concurrency-decorators";

export const FILTER_FORM_UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c'

const TEMP_SOURCE_NODE = new rdflib.NamedNode('http://frontend-toezicht-abb/temp-source-node')

export const SH = new rdflib.Namespace("http://www.w3.org/ns/shacl#");
export const SEARCH = new rdflib.Namespace("http://redpencil.data.gift/vocabularies/search-queries/");

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  @service router;
  @service currentSession;

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

  async willDestroy() {
    this.formStore.deregisterObserver(FILTER_FORM_UUID);
  }

  // USER ACTIONS

  @action
  loadFilters() {
    this.router.transitionTo('user.search-queries')
  }

  @task
  * saveFilter() {
    const query = this.store.createRecord('search-query', {});
    yield query.save();

    const user = yield this.currentSession.user;
    user.searchQueries.pushObject(query);
    yield user.save();

    // NOTE: we need to update the local source data in the store with the created search-query
    yield this.loadSource(query)

    // NOTE: replace the temporary source-node with the uri of the saved query
    const updated = this.formStore
      .match(TEMP_SOURCE_NODE, undefined, undefined, this.graphs.sourceGraph)
      .map(t => {t.subject = this.sourceNode; return t});

    if(updated.length) {
      // NOTE: for some reason removeMatches() does not call the observers (pretty ok with that in this use case)
      this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined, this.graphs.sourceGraph);
      this.formStore.addAll(updated);
    }

    yield this.saveSource(query);

    this.router.transitionTo('user.search-queries.edit', query);
  }

  // TODO improve as this is a little hackish
  // NOTE: the problem here lies in that if an outsider makes changes in the store,
  // the field components are not aware of this. There for, for now, we force the form to rerender by temporarily
  // changing the "show" argument.
  @action
  resetFilters() {
    // this.refreshing = true;
    // // NOTE: for some reason removeMatches() does not call the observers (pretty ok with that in this use case)
    // this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined, this.graphs.sourceGraph);
    // this.updateQueryParams(this.formStore.match(undefined, undefined, undefined));
    // setTimeout(() => {
    //   this.refreshing = false;
    // }, 1);
  }

  // INTERNAL LOGIC

  /**
   * Registers the necessary observer to allow the filter to work on change of the form-store.
   */
  registerObserver(){
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
      const field = this.formStore.any(undefined, SEARCH('key'), key, this.graphs.formGraph);
      const path = this.formStore.any(field, SH('path'), undefined, this.graphs.formGraph);
      const values = this.args.filter[key] && this.args.filter[key].split(',')
      values && values.forEach(v => this.formStore.graph.add(
        this.sourceNode,
        path,
        this.validURL(v) ? new rdflib.NamedNode(v) : v,
        this.graphs.sourceGraph))
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
      const values = this.formStore.match(t.subject, t.predicate, undefined, this.graphs.sourceGraph).map(t => t.object.value);
      const field = this.formStore.any(undefined, SH('path'), t.predicate, this.graphs.formGraph);
      const key = this.formStore.any(field, SEARCH('key'), undefined, this.graphs.formGraph);
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
