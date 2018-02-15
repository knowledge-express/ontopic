import * as rdf from 'rdf';
import { promises as jsonld } from 'jsonld';

import Query from '../query';
import { JSONLD } from '../data';
import { MutableStore } from '.';

export type Graph = {
  byId: {
    [key: string]: JSONLD.Document
  }
  other: JSONLD.Document[]
};

export function create(): MutableStore<JSONLD.Document> {
  // This store does not support labels
  const graph = {
    byId: {},
    other: []
  };

  return {
    add: (data: JSONLD.Document) => add(graph, data),
    remove: (data: JSONLD.Document) => remove(graph, data),
    query: (q) => query(graph, q),
    getValues: null,
    filter: null,
  };
};

export async function query(graph: Graph, query: Query) {
  const _graph = [ ...Object.keys(graph.byId).map(key => graph.byId[key]), ...graph.other ]
  const framed = await jsonld.frame(_graph, query);
  return framed['@graph'][0];
}

export function add(graph: Graph, data: JSONLD.Document) {
  if ('@id' in data) graph.byId[data['@id']] = data;
  else graph.other.push(data);
  return data;
};

export function remove(graph: Graph, data: JSONLD.Document) {
  if ('@id' in data) delete graph.byId[data['@id']];
  else {
    throw new Error('Not implemented.');
  }
  return data;
};

export default {
  create,
  query,
  add,
  remove
};
