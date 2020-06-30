import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';
import { v4 as uuid } from 'uuid';

const RDF = new rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FORM = new rdflib.Namespace("http://lblod.data.gift/vocabularies/forms/");

const SOURCE_BASE = 'http://lblod.data.gift/vocabularies/search-queries-toezicht/';

export default class SearchQueriesFormComponent extends Component {
  @service store
  @service router

  @tracked form
  @tracked formStore
  @tracked graphs
  @tracked sourceNode

  constructor(options, owner, args) {
    super(owner, args);
    this.loadData.perform(options);
  }

  @task
  * loadData(options) {
    let query = this.args.query;

    // NOTE: if no query model was supplied, we assume this is a TEMP search-query being used to filter
    if(!query) {
      query = this.store.createRecord('search-query', {
        uri: `${SOURCE_BASE}${uuid()}`
      });
    }

    let response = yield fetch(`/search-query-forms/${options.form.uuid}`);
    const form = yield response.text();

    response = yield fetch(`/search-query-forms/${options.form.uuid}/meta`);
    const meta = yield response.text();

    response = yield fetch(`/search-queries/${query.id}`, {
      method: 'GET',
      headers: {'Accept': 'text/turtle'}
    });
    const source = yield response.text();

    // Prepare data in forking store
    const formStore = new ForkingStore();

    const formGraph = new rdflib.NamedNode("http://data.lblod.info/form");
    yield formStore.parse(form, formGraph, "text/turtle");

    const metaGraph = new rdflib.NamedNode("http://data.lblod.info/metagraph");
    yield formStore.parse(meta, metaGraph, "text/turtle");

    const sourceGraph = new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`);
    yield formStore.parse(source, sourceGraph, "text/turtle");

    this.formStore = formStore;
    this.graphs = {formGraph, sourceGraph, metaGraph};
    this.form = formStore.any(undefined, RDF("type"), FORM("Form"), formGraph);
    this.sourceNode = new rdflib.NamedNode(query.uri);
  }
}
