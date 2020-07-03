import SearchQueriesFormComponent from "./form";
import rdflib from 'browser-rdflib';
import { action } from '@ember/object';

const UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c'

const SH = new rdflib.Namespace("http://www.w3.org/ns/shacl#");
const SEARCH = new rdflib.Namespace("http://redpencil.data.gift/vocabularies/search-queries/");

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super({form: {uuid: UUID}}, owner, args);
  }

  async loadData(options) {
    await super.loadData(options);
    this.loadFilters();
    this.updateFilters(this.formStore.match(this.sourceNode, undefined, undefined, this.graphs.sourceGraph));
    this.formStore.registerObserver(({inserts = [], deletes = []}) => {
      this.updateFilters([...inserts, ...deletes]);
      this.args.onFilterChange();
    }, UUID);
  }

  updateFilters(triples) {
    triples.forEach(t => {
      // NOTE: we need to retrieve the value because on deletion we get the deleted value, not the actual new value
      const values = this.formStore.match(t.subject, t.predicate, undefined, this.graphs.sourceGraph).map(t => t.object.value);
      const field = this.formStore.any(undefined, SH('path'), t.predicate, this.graphs.formGraph);
      const key = this.formStore.any(field, SEARCH('key'), undefined, this.graphs.formGraph);
      if(key) {
        this.args.filter[key.value] = values.join(',');
      }
    });
  }

  loadFilters() {
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
  resetFilters() {
    const deletes = this.formStore.match(undefined, undefined, undefined, this.graphs.sourceGraph);
    this.formStore.removeStatements(deletes);
  }
}
