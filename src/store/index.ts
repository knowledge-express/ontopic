const rdf = require('rdf');

import { Encoder } from '../data';

import * as Bus from '../bus';
import { Subject } from '../bus/observable';

import Query from '../query';

export type ReadableStore<V> = {
  query: (query: Query) => V | Promise<V>;
  filter: (types: string[], predicate: string, value: string) => V[] | Promise<V[]>
  getValues: (object: string, predicate: string) => string[] | Promise<string[]>
};

export type MutableStore<V> = ReadableStore<V> & {
  add: (data: V) => V | Promise<V>;
  remove: (data: V) => V | Promise<V>;
};

export type Store<V> = ReadableStore<V> | MutableStore<V>;

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

// export function connect<V>(store: MutableStore<V>, bus: Bus.MutableBus<V>): Store<V> {
//   // Make sure we get an update whenever the store is modified directly
//   const updates = Subject.create<Bus.Mutation<V>>();
//   async function add(data: V) {
//     return await updates.onNext({ action: 'add', data: await store.add(data) });
//   }
//
//   async function remove(data) {
//     return await updates.onNext({ action: 'remove', data: await store.remove(data) });
//   }
//
//   // Make sure the bus is subscribed to the processed updates
//   updates.subscribe(bus.subject);
//
//   return {
//     ...store,
//     add,
//     remove
//   };
// };

export function encode<V, W>(store: MutableStore<V>, encoder: Encoder<W, V>): MutableStore<W> {
  async function query(query: Query): Promise<W> {
    return null;
  }

  async function filter(): Promise<W[]> {
    return null;
  }

  async function getValues(): Promise<string[]> {
    return null;
  }

  async function add(data: W): Promise<W> {
    const encoded = await encoder.encode(data);
    const decoded = await encoder.decode(await store.add(encoded));
    return decoded;
  }

  async function remove(data: W): Promise<W> {
    const encoded = await encoder.encode(data);
    const decoded = await encoder.decode(await store.remove(encoded));
    return decoded;
  }

  return {
    query,
    filter,
    getValues,
    add,
    remove,
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

export default Store;
