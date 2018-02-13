const rdf = require('rdf');

import Query from '../query';

export type ReadableStore<V> = {
  query: (query: Query) => V | Promise<V>;
  filter: (types: string[], predicate: string, value: string) => V[]
  getValues: (object: string, predicate: string) => string[]
};

export type MutableStore<V> = ReadableStore<V> & {
  add: (data: V) => V | Promise<V>;
  remove: (data: V) => V | Promise<V>;
};

export type Store<V> = ReadableStore<V> | MutableStore<V>;

export module Store {
  export function isStore<V>(obj: object): obj is Store<V> {
    // Every store should be readable, but nevermind the fallback
    return isReadableStore(obj) || isMutableStore(obj);
  };

  export function isReadableStore<V>(store: object): store is ReadableStore<V> {
    return typeof store === 'object' && 'query' in store;
  };

  export function isMutableStore<V>(store: object): store is MutableStore<V> {
    return isReadableStore<V>(store) && 'add' in store && 'remove' in store;
  };

  export function readOnly<V>(store: Store<V>): ReadableStore<V> {
    return {
      query: store.query,
      filter: store.filter,
      getValues: store.getValues,
    };
  };

  // TODO: Support lenses to allow mapping of MutableStores
  // export type MapFn<V, W> = (v: V) => W | Promise<W>;
  // export function map<V, W>(store: Store<V>, mapFn: MapFn<V, W>): Store<W> {
  //   let res = {
  //     query: async (q) => mapFn(await store.query(q))
  //   };
  //
  //   // We know it's a MutableStore already, but this gives us typing
  //   if(isMutableStore(store)) {
  //     // We need lenses in order to be able to map MutableStores.
  //     throw new Error('Not implemented.');
  //
  //     // return {
  //     //   ...res,
  //     //   add: async (data) => mapFn(await store.add(await mapFn(data))
  //     //   // add: (data)
  //     // };
  //   }
  //
  //   return res;
  // };
};

export default Store;
