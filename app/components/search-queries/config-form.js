import SearchQueriesFormComponent from "./form";

import fetch from 'node-fetch';
import {task} from 'ember-concurrency-decorators';

const UUID = 'ebd65df9-5566-47c2-859a-ceff562881ab'

export default class SearchQueriesConfigFormComponent extends SearchQueriesFormComponent {

  constructor(owner, args) {
    super({form: {uuid: UUID}}, owner, args);
  }

  @task
  * save() {
    const query = this.args.query;
    const source = this.formStore.serializeDataMergedGraph(this.graphs.sourceGraph, "text/turtle");
    yield fetch(`/search-queries/${query.id}`, {
      method: 'PUT',
      body: source,
      headers: {'Content-type': 'text/turtle'}
    });
  }
}
