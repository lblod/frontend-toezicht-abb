import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';
import {v4 as uuid} from 'uuid';

const RDF = new rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FORM = new rdflib.Namespace("http://lblod.data.gift/vocabularies/forms/");

const SOURCE_BASE = 'http://lblod.data.gift/vocabularies/search-queries-toezicht/';
export const TEMP_SOURCE_NODE = 'http://frontend-toezicht-abb/temp-source-node'

export default class SearchQueriesFormComponent extends Component {
  @service store
  @service router
  @service currentSession

  @tracked form
  @tracked formStore
  @tracked graphs = {
    formGraph: new rdflib.NamedNode("http://data.lblod.info/form"),
    metaGraph: new rdflib.NamedNode("http://data.lblod.info/metagraph"),
    sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`)
  }
  @tracked sourceNode

  constructor(options, owner, args) {
    super(owner, args);
    this.init.perform(options);
  }

  async willDestroy() {
    this.formStore.observers = {};
  }

  @task
  * init(options) {
    yield this.loadData(options);
  }

  async loadData(options) {
    this.formStore = new ForkingStore();
    await this.loadForm(options.form.uuid);
    await this.loadMeta(options.form.uuid);
    await this.loadSource(this.args.query);
  }


  async loadForm(uuid) {
    let response = await fetch(`/search-query-forms/${uuid}`);
    const ttl = await response.text();
    await this.formStore.parse(ttl, this.graphs.formGraph, "text/turtle");
    this.form = this.formStore.any(undefined, RDF("type"), FORM("Form"), this.graphs.formGraph);
  }

  async loadMeta(uuid) {
    let response = await fetch(`/search-query-forms/${uuid}/meta`);
    const ttl = await response.text();
    await this.formStore.parse(ttl, this.graphs.metaGraph, "text/turtle");
  }

  async loadSource(query) {
    if (query) {
      let response = await fetch(`/search-queries/${query.id}`, {
        method: 'GET',
        headers: {'Accept': 'text/turtle'}
      });
      const ttl = await response.text();
      await this.formStore.parse(ttl, this.graphs.sourceGraph, "text/turtle");
      this.sourceNode = this.sourceNode = new rdflib.NamedNode(query.uri);
    } else {
      // NOTE: if no query model was supplied, we assume this is a TEMP search-query being used to filter
      this.sourceNode = this.sourceNode = new rdflib.NamedNode(TEMP_SOURCE_NODE);
    }
  }
}
