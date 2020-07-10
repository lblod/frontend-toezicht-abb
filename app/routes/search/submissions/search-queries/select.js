import Route from '@ember/routing/route';
import fetch from 'node-fetch';
import rdflib from 'browser-rdflib';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import {
  SEARCH,
  SH,
  FILTER_FORM_UUID,
} from '../../../../components/search-queries/filter-form';

const GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

export default class SearchSubmissionSearchQueriesSelectRoute extends Route {

  async model(params) {
    const store = new ForkingStore();
    const searchQuery = await this.store.findRecord('search-query', params.id);
    await this.loadForm(store);
    await this.loadSource(store, searchQuery);
    return {
      store,
      searchQuery,
    };
  }

  afterModel(model) {
    const {store, searchQuery} = model;
    const sourceNode = new rdflib.NamedNode(searchQuery.uri);
    let query = {queryParams: {}};

    const keys = store.match(undefined, SEARCH('key'), undefined, GRAPHS.formGraph);
    keys && keys.forEach(key => {
      const path = store.any(key.subject, SH('path'), undefined, GRAPHS.formGraph);
      const values = store.match(sourceNode, path, undefined, GRAPHS.sourceGraph);
      if (values && values.length) {
        query.queryParams[key.object.value] = values.map(v => v.object.value).join(',');
      } else{
        // NOTE: explicitly set value to prevent "sticky" query-params
        query.queryParams[key.object.value] = null;
      }
    });
    this.transitionTo('search.submissions', query);
  }

  async loadForm(store) {
    let response = await fetch(`/search-query-forms/${FILTER_FORM_UUID}`);
    const ttl = await response.text();
    await store.parse(ttl, GRAPHS.formGraph, 'text/turtle');
  }

  async loadSource(store, query) {
    let response = await fetch(`/search-queries/${query.id}`, {
      method: 'GET',
      headers: {'Accept': 'text/turtle'},
    });
    const ttl = await response.text();
    await store.parse(ttl, GRAPHS.sourceGraph, 'text/turtle');
  }
}
