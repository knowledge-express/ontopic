import * as rdf from 'rdf';
import { promises as jsonld } from 'jsonld';

import { Quad } from '../data';
import { MutableStore, Query } from '.';

export type Graph = {
  add: (triple: object) => void
  remove: (triple: object) => void
  toArray: () => any[]
};

export function create(): MutableStore<Quad[]> {
  // This store does not support labels
  const graph: Graph = new rdf.Graph;
  //
  return {
    add: (data: Quad[]) => add(graph, data),
    remove: (data: Quad[]) => remove(graph, data),
    query: (q) => query(graph, q)
  };
};

// TODO: Make this more effecient. Please?
export async function query(graph: Graph, query: Query) {
  const quads = graph.toArray();

  const nquads = Quad.toNQuads(quads);

  // Convert quads to JSON-LD
  const doc = await jsonld.fromRDF(nquads);

  // Frame with query
  const framed = await jsonld.frame(doc, query);

  // Convert result back into quads
  const resultNQuads = await jsonld.toRDF(framed, { format: 'application/nquads' });
  const resultQuads = Quad.fromNQuads(resultNQuads).reverse();

  // Remove labels
  return resultQuads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
}

export function add(graph: Graph, data: Quad[]) {
  return data.map(quad => {
    const { subject, predicate, object } = quad;
    graph.add(rdf.environment.createTriple(subject, predicate, object));
    return quad;
  });
};

export function remove(graph: Graph, data: Quad[]) {
  return data.map(quad => {
    const { subject, predicate, object } = quad;
    graph.remove(rdf.environment.createTriple(subject, predicate, object));
    return quad;
  });
};

export default {
  query,
  add,
  remove
};
