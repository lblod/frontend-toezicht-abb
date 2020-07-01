import SearchQueriesFormComponent from "./form";
import rdflib from 'browser-rdflib';
import {task} from "ember-concurrency-decorators";

const UUID = 'e025a601-b50b-4abd-a6de-d0c3b619795c'

const SH = new rdflib.Namespace("http://www.w3.org/ns/shacl#");
const SEARCH = new rdflib.Namespace("http://redpencil.data.gift/vocabularies/search-queries/");

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super({form: {uuid: UUID}}, owner, args);
  }

 // @task
 // * loadData(options) {
 //   yield super.loadData.perform(options);
 // }

  updateFilters({inserts = [], deletes = []}) {
    const triples = [...inserts, ...deletes];
    triples.forEach(t => {
      // NOTE: we need to retrieve the value because on deletion we get the deleted value, not the actual new value
      const values = this.formStore.match(t.subject, t.predicate, undefined, this.graphs.sourceGraph).map(t => t.object.value);
      const field = this.formStore.any(undefined, SH('path'), t.predicate, this.graphs.formGraph);
      const key = this.formStore.any(field, SEARCH('key'), undefined, this.graphs.formGraph);

      this.args.filter[key.value] = values.join(',');

      console.log(`Used field: ${field}`);
      console.log(`Insert ${values.join(',')} for key ${key}`)
    })
    this.args.onFilterChange();
  }

  loadFilters() {
    console.log("loading filters ...");
  }

  // TODO for now just clear everything, but maybe in the future reset to the loaded query?
  resetFilters() {
  }
}
