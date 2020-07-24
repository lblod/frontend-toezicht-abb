import Route from '@ember/routing/route';
import rdflib from 'browser-rdflib';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {
  formStoreToQueryParams,
  retrieveFormData,
  retrieveSourceData,
} from '../../../../utils/filter-form-helpers';
import {FILTER_FORM_UUID} from '../../../../components/search-queries/filter-form';

export default class SearchSubmissionSearchQueriesSelectRoute extends Route {

  async model(params) {
    const store = new ForkingStore();
    const query = await this.store.findRecord('search-query', params.id);
    await retrieveFormData(`/search-query-forms/${FILTER_FORM_UUID}`, store);
    await retrieveSourceData(`/search-queries/${query.id}`, store);
    return {
      store,
      node: new rdflib.NamedNode(query.uri),
    };
  }

  afterModel(model) {
    const {store, node} = model;
    this.transitionTo('search.submissions', formStoreToQueryParams(store, node));
  }
}
