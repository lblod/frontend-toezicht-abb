import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {task} from 'ember-concurrency-decorators';
import {FORM, FORM_GRAPHS, RDF, retrieveFormData, retrieveMetaData, retrieveSourceData} from '../../utils/rdf-form';

export const TEMP_SOURCE_NODE = new rdflib.NamedNode('http://frontend-toezicht-abb/temp-source-node');

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
    yield this.setupForm(form);
  }

  async setupForm(form) {
    this.formStore = new ForkingStore();
    this.sourceNode = TEMP_SOURCE_NODE;
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
    // NOTE: if source was retrieved we need to set the source-node to this data.
    this.sourceNode = new rdflib.NamedNode(query.uri);
  }

  async updateSourceData(query) {

    const updated = this.formStore.match(this.sourceNode, undefined, undefined, FORM_GRAPHS.sourceGraph);

    // NOTE: we need to make sure the local store is up-to-date with changes made on the remote
    // WARNING! this updates the source-node
    await this.retrieveSourceData(query);

    // NOTE: we need to update the source-node to the actual one
    updated.forEach( t => t.subject = this.sourceNode);

    if (updated.length) {
      this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined, FORM_GRAPHS.sourceGraph);
      this.formStore.addAll(updated);
    }

    // TODO: generalise this function by placing it in the helper file
    await fetch(`/search-queries/${query.id}`, {
      method: 'PUT',
      body: this.formStore.serializeDataMergedGraph(FORM_GRAPHS.sourceGraph, 'text/turtle'),
      headers: {'Content-type': 'text/turtle'},
    });
  }

  // TODO: generalise this function by placing it in the helper file
  async removeSourceData(query) {
    await fetch(`/search-queries/${query.id}`, {
      method: 'DELETE',
    });
  }
}
