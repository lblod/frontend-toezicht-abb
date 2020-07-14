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
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Accept': 'text/turtle'},
  });
  const ttl = await response.text();
  store.parse(ttl, FORM_GRAPHS.formGraph, 'text/turtle');
}

export async function retrieveMetaData(url, store) {
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Accept': 'application/n-triples'},
  });
  const ttl = await response.text();
  store.parse(ttl, FORM_GRAPHS.metaGraph, 'text/turtle');
}

export async function retrieveSourceData(url, store) {
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Accept': 'text/turtle'},
  });
  const ttl = await response.text();
  store.parse(ttl, FORM_GRAPHS.sourceGraph, 'text/turtle');
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
  const keys = store.match(undefined, SEARCH('emberQueryParameterKey'), undefined, FORM_GRAPHS.formGraph);
  if (keys && keys.length) {
    for (let key of keys) {
      const path = store.any(key.subject, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = store.match(node, path, undefined, FORM_GRAPHS.sourceGraph);
      if (values && values.length) {
        query.queryParams[key.object.value] = values.map(v => v.object.value).join(',');
      } else {
        // NOTE: explicitly set value to prevent "sticky" query-params
        query.queryParams[key.object.value] = null;
      }
    }
  }
  return query;
}

export function queryParamsToFormStore(query, store, node) {
  const keys = Object.keys(query);
  for (let key of keys) {
    const field = store.any(undefined, SEARCH('emberQueryParameterKey'), key, FORM_GRAPHS.formGraph);
    if (field) {
      const path = store.any(field, SH('path'), undefined, FORM_GRAPHS.formGraph);
      const values = query[key] && query[key].split(',');
      if (values && values.length) {
        for (let value of values) {
          const rdfv = validURL(value) ? new rdflib.NamedNode(value) : value;
          store.graph.add(node, path, rdfv, FORM_GRAPHS.sourceGraph);
        }
      }
    }
  }
}

// TODO simplify
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}
