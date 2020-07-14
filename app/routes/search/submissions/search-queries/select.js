import Route from '@ember/routing/route';
import rdflib from 'browser-rdflib';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {
  SEARCH,
  SH,
  FILTER_FORM_UUID,
} from '../../../../components/search-queries/filter-form';
import {FORM_GRAPHS} from '../../../../components/search-queries/form';
import {retrieveFormData, retrieveSourceData} from '../../../../utils/rdf-form';

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
    let query = {queryParams: {}};

    const keys = store.match(undefined, SEARCH('key'), undefined, FORM_GRAPHS.formGraph);
    keys && keys.forEach(key => {
      const path = store.any(key.subject, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = store.match(node, path, undefined, FORM_GRAPHS.sourceGraph);
      if (values && values.length) {
        query.queryParams[key.object.value] = values.map(v => v.object.value).join(',');
      } else{
        // NOTE: explicitly set value to prevent "sticky" query-params
        query.queryParams[key.object.value] = null;
      }
    });
    this.transitionTo('search.submissions', query);
  }
}
