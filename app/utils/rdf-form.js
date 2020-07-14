import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';
import {TEMP_SOURCE_NODE} from '../components/search-queries/form';

export const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
export const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
export const SH = new rdflib.Namespace('http://www.w3.org/ns/shacl#');
export const SEARCH = new rdflib.Namespace('http://redpencil.data.gift/vocabularies/search-queries/');

export const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

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
