import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';
import {FORM, FORM_GRAPHS, RDF, retrieveFormData, retrieveMetaData, retrieveSourceData} from '../../utils/rdf-form';

export default class SearchQueriesFormComponent extends Component {

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

  get graphs() {
    return FORM_GRAPHS;
  }

  get form() {
    return this.formStore.any(undefined, RDF('type'), FORM('Form'), FORM_GRAPHS.formGraph);
  }

  @task
  * init(form) {
    yield this.loadData(form);
  }

  async loadData(form) {
    this.formStore = new ForkingStore();
    await this.retrieveFormData(form);
    await this.retrieveMetaData(form);
  }

  async retrieveFormData(uuid) {
    await retrieveFormData(`/search-query-forms/${uuid}`, this.formStore);
  }

  async retrieveMetaData(uuid) {
    await retrieveMetaData(`/search-query-forms/${uuid}/meta`, this.formStore);
  }

  async retrieveSourceData(query) {
    await retrieveSourceData(`/search-queries/${query.id}`, this.formStore);
    this.sourceNode = new rdflib.NamedNode(query.uri);
  }

  async saveSourceData(query) {
    await fetch(`/search-queries/${query.id}`, {
      method: 'PUT',
      body: this.formStore.serializeDataMergedGraph(FORM_GRAPHS.sourceGraph, 'text/turtle'),
      headers: {'Content-type': 'text/turtle'},
    });
  }

  async removeSourceData(query) {
    await fetch(`/search-queries/${query.id}`, {
      method: 'DELETE',
    });
  }
}
