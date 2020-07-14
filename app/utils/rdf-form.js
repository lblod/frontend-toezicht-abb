import rdflib from 'browser-rdflib';
import fetch from 'node-fetch';

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
