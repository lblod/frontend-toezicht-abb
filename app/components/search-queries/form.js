import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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
  TEMP_SOURCE_NODE,
} from '../../utils/filter-form-helpers';

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
    this.sourceNode = await retrieveSourceData(query.uri, `/search-queries/${query.id}`, this.formStore);
  }

  // TODO redo (to prone for errors)
  async saveSourceData(query) {
    // NOTE: if no query is provided, we create a new one
    //  as`this.retrieveSourceData(query)` expects one.
    if (!query) {
      const user = await this.currentSession.user;
      query = this.store.createRecord('search-query', {
        user,
      });
      await query.save();
    }

    // NOTE: update local source-data and source-node
    await this.retrieveSourceData(query);

    // NOTE: save the source-data
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

