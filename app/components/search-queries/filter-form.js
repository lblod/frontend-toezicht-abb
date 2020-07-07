import SearchQueriesFormComponent, {TEMP_SOURCE_NODE} from "./form";
import rdflib from 'browser-rdflib';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';
import {task} from "ember-concurrency-decorators";
import fetch from "node-fetch";

export const UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c'

export const SH = new rdflib.Namespace("http://www.w3.org/ns/shacl#");
export const SEARCH = new rdflib.Namespace("http://redpencil.data.gift/vocabularies/search-queries/");

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  @service router;
  @service currentSession;

  @tracked refreshing = false;

  constructor(owner, args) {
    super({form: {uuid: UUID}}, owner, args);
  }

  async loadData(options) {
    await super.loadData(options);
    this.loadQueryParams();
    // NOTE: this could be useful in the future, but for now we assume the filter-form never receives a search-query.
    //       So, no need to update the query-parameters to represent the received search-query.

    // `this.updateFilters(this.formStore.match(this.sourceNode, undefined, undefined, this.graphs.sourceGraph));`

    this.formStore.registerObserver(({inserts = [], deletes = []}) => {
      this.updateQueryParams([...inserts, ...deletes]);
      this.args.onFilterChange();
    }, UUID);
    this.args.onFilterChange();
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

    // NOTE: we need to update the local store with the created search-query
    yield this.loadSource(query)

    // NOTE: replace the temporary source-node with the uri of the saved query
    const tempNode = new rdflib.NamedNode(TEMP_SOURCE_NODE);
    const toUpdate = this.formStore.match(tempNode, undefined, undefined, this.graphs.sourceGraph);
    toUpdate.forEach(t => t.subject = this.sourceNode);
    this.formStore.removeMatches(tempNode, undefined, undefined, this.graphs.sourceGraph);
    this.formStore.addAll(toUpdate);

    const source = this.formStore.serializeDataMergedGraph(this.graphs.sourceGraph, "text/turtle");

    yield fetch(`/search-queries/${query.id}`, {
      method: 'PUT',
      body: source,
      headers: {'Content-type': 'text/turtle'}
    });

    this.router.transitionTo('user.search-queries.edit', query);
  }

  // TODO improve as this is a little hackish
  @action
  resetFilters() {
    this.refreshing = true;
    this.formStore.removeMatches(undefined, undefined, undefined, this.graphs.sourceGraph);
    setTimeout(() => {
      this.refreshing = false;
    }, 1);
  }
}
