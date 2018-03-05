import * as rdf from 'rdf';

import { Quad } from '../data';
import { MutableStore } from '.';

export type Graph = {
  match(subject?: string, predicate?: string, object?: string): Quad[]
  add(triple: object): void
  remove(triple: object): void
  toArray(): Quad[]
};

export type EphemeralStore = MutableStore<Quad[]> & {
  graph: Graph
};

export module EphemeralStore {
  export function create(): EphemeralStore {
    const graph: Graph = new rdf.Graph;

    const store = {
      graph,
      getPropertyValue: async (id, property) => getPropertyValue(store, id, property),
      findBy: async () => findBy(store),
      add: (data: Quad[]) => add(store, data),
      remove: (data: Quad[]) => remove(store, data),
    };

    return store;
  };

  export async function getPropertyValue(store: EphemeralStore, id, property): Promise<string | Array<string>> {
    const objects = store.graph.match(id, property, null).map(t => t.object);
    return objects.length === 1 ? objects[0] : objects.length ? objects : null;
  }

  export async function findBy(store: EphemeralStore) {
    return null;
  }

  export function add(store: EphemeralStore, data: Quad[]) {
    return data.map(quad => {
      const { subject, predicate, object } = quad;
      store.graph.add(rdf.environment.createTriple(subject, predicate, object));
      return quad;
    });
  };

  export function remove(store: EphemeralStore, data: Quad[]) {
    return data.map(quad => {
      const { subject, predicate, object } = quad;
      store.graph.remove(rdf.environment.createTriple(subject, predicate, object));
      return quad;
    });
  };
};

export default EphemeralStore;
