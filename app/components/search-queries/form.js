import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';

const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');

export const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

export default class SearchQueriesFormComponent extends Component {

  graphs = FORM_GRAPHS;

  @service store;
  @service router;
  @service currentSession;

  @tracked form;
  @tracked formStore;
  @tracked sourceNode;

  constructor(form, owner, args) {
    super(owner, args);
    this.init.perform(form);
  }

  @task
  * init(form) {
    yield this.loadData(form);
  }

  async loadData(form) {
    this.formStore = new ForkingStore();
    await this.loadForm(form);
    await this.loadMeta(form);
  }

  async loadForm(uuid) {
    let response = await fetch(`/search-query-forms/${uuid}`,{
      method: 'GET',
      headers: {'Accept': 'text/turtle'},
    });
    const ttl = await response.text();
    await this.formStore.parse(ttl, FORM_GRAPHS.formGraph, 'text/turtle');
    this.form = this.formStore.any(undefined, RDF('type'), FORM('Form'), FORM_GRAPHS.formGraph);
  }

  async loadMeta(uuid) {
    let response = await fetch(`/search-query-forms/${uuid}/meta`,{
      method: 'GET',
      headers: {'Accept': 'application/n-triples'},
    });
    const ttl = await response.text();
    await this.formStore.parse(ttl, FORM_GRAPHS.metaGraph, 'text/turtle');
  }

  async loadSource(query) {
    let response = await fetch(`/search-queries/${query.id}`, {
      method: 'GET',
      headers: {'Accept': 'text/turtle'},
    });
    const ttl = await response.text();
    await this.formStore.parse(ttl, FORM_GRAPHS.sourceGraph, 'text/turtle');
    this.sourceNode = new rdflib.NamedNode(query.uri);
  }

  async saveSource(query) {
    await fetch(`/search-queries/${query.id}`, {
      method: 'PUT',
      body: this.formStore.serializeDataMergedGraph(FORM_GRAPHS.sourceGraph, 'text/turtle'),
      headers: {'Content-type': 'text/turtle'},
    });
  }

  async removeSource(query) {
    await fetch(`/search-queries/${query.id}`, {
      method: 'DELETE',
    });
  }
}
