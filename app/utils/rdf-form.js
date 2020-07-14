import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';

export const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
export const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
export const SH = new rdflib.Namespace('http://www.w3.org/ns/shacl#');
export const SEARCH = new rdflib.Namespace('http://redpencil.data.gift/vocabularies/search-queries/');

export const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

// API CALLS

export async function retrieveFormData(url, store) {
  let response = await fetch(url,{
    method: 'GET',
    headers: {'Accept': 'text/turtle'},
  });
  const ttl = await response.text();
  await store.parse(ttl, FORM_GRAPHS.formGraph, 'text/turtle');
}

export async function retrieveMetaData(url, store) {
  let response = await fetch(url,{
    method: 'GET',
    headers: {'Accept': 'application/n-triples'},
  });
  const ttl = await response.text();
  await store.parse(ttl, FORM_GRAPHS.metaGraph, 'text/turtle');
}

export async function retrieveSourceData(url, store) {
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Accept': 'text/turtle'},
  });
  const ttl = await response.text();
  await store.parse(ttl, FORM_GRAPHS.sourceGraph, 'text/turtle');
}

export async function saveSourceData(url, store) {
  await fetch(url, {
    method: 'PUT',
    body: store.serializeDataMergedGraph(FORM_GRAPHS.sourceGraph, 'text/turtle'),
    headers: {'Content-type': 'text/turtle'},
  });
}

export async function removeSourceData(url) {
  await fetch(url, {
    method: 'DELETE',
  });
}

// FORM-DATA TO QUERY-PARAMS LOGIC

/**
 * Converts the data within the store to an Ember query-param object.
 *
 * @param store
 * @param node
 * @returns {{queryParams: {}}}
 */
export function formStoreToQueryParams(store, node) {
  let query = {queryParams: {}};
  // NOTE: retrieve all possible query-params
  const keys = store.match(undefined, SEARCH('key'), undefined, FORM_GRAPHS.formGraph);
  if(keys && keys.length) {
    for(let key of keys) {
      const path = store.any(key.subject, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = store.match(node, path, undefined, FORM_GRAPHS.sourceGraph);
      if (values && values.length) {
        query.queryParams[key.object.value] = values.map(v => v.object.value).join(',');
      } else{
        // NOTE: explicitly set value to prevent "sticky" query-params
        query.queryParams[key.object.value] = null;
      }
    }
  }
  return query;
}

// TODO
export function queryParamsToFormStore() {
    this.args.filter.keys.forEach(key => {
      const field = this.formStore.any(undefined, SEARCH('key'), key, FORM_GRAPHS.formGraph);
      const path = this.formStore.any(field, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = this.args.filter[key] && this.args.filter[key].split(',');
      values && values.forEach(v => this.formStore.graph.add(
        this.sourceNode,
        path,
        this.validURL(v) ? new rdflib.NamedNode(v) : v, FORM_GRAPHS.sourceGraph));
    });
}
