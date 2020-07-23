import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import rdflib from 'browser-rdflib';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { task } from 'ember-concurrency-decorators';
import {
  FORM,
  FORM_GRAPHS,
  RDF,
  removeSourceData,
  retrieveFormData,
  retrieveMetaData,
  retrieveSourceData,
  saveSourceData,
} from '../../utils/rdf-form';

export const TEMP_SOURCE_NODE = new rdflib.NamedNode('http://frontend-toezicht-abb/temp-source-node');

export default class SearchQueriesFormComponent extends Component {

  @service store;
  @service router;
  @service currentSession;

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
    const store = new ForkingStore();
    this.sourceNode = TEMP_SOURCE_NODE;
    await this.retrieveFormData(form, store);
    await this.retrieveMetaData(form, store);
    this.formStore = store;
  }

  async retrieveFormData(uuid, store) {
    await retrieveFormData(`/search-query-forms/${uuid}`, store);
  }

  async retrieveMetaData(uuid, store) {
    await retrieveMetaData(`/search-query-forms/${uuid}/meta`, store);
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
    updated.forEach(t => t.subject = this.sourceNode);

    if (updated.length) {
      this.formStore.removeMatches(TEMP_SOURCE_NODE, undefined, undefined);
      this.formStore.addAll(updated);
    }
    await saveSourceData(`/search-queries/${query.id}`, this.formStore);

    // The call
    //  await saveSourceData(`/search-queries/${query.id}`, this.formStore);
    // Is handled by another service. This generates delta that mu-cl-resource needs to process.
    // But takes som time. Currently the easiest fix, is wait a little longer.
    await new Promise(resolve => setTimeout(resolve, 1000)); //This sleeps a little before moving on.
    // This will fail some time. A better solution would be to manually update ember-datastore.
    // The ultimate solution is push updates
  }

  async removeSourceData(query) {
    await removeSourceData(`/search-queries/${query.id}`);
  }
}
