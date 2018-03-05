const rdf = require('rdf');

import { Encoder } from '../data';

import * as Bus from '../bus';
import { Subject } from '../bus/observable';

import Query from '../query';

export * from './composite';

export type ReadableStore = {
  getPropertyValue(id: string, property: string): string | object | string[] | object[] // Actually traverse to get the property
  findBy(types: string[], property: string, value: string): string | object | string[] | object[] // This is only used when following inverse relationships.
};

export type MutableStore<V> = ReadableStore & {
  add: (data: V) => V | Promise<V>;
  remove: (data: V) => V | Promise<V>;
};

export type Store<V> = ReadableStore | MutableStore<V>;

export function isStore<V>(obj: object): obj is Store<V> {
  // Every store should be readable, but nevermind the fallback
  return isReadableStore(obj) || isMutableStore(obj);
};

export function isReadableStore(store: object): store is ReadableStore {
  return typeof store === 'object' && 'getPropertyValue' in store && 'findBy' in store;
};

export function isMutableStore<V>(store: object): store is MutableStore<V> {
  return isReadableStore(store) && 'add' in store && 'remove' in store;
};

export function readOnly<V>(store: Store<V>): ReadableStore {
  return {
    getPropertyValue: store.getPropertyValue,
    findBy: store.findBy,
    // query: store.query,
    // filter: store.filter,
    // getValues: store.getValues,
  };
};

export function encode<V, W>(store: MutableStore<V>, encoder: Encoder<V, W>): MutableStore<W>;
// export function encode<V, W>(store: ReadableStore, encoder: Encoder<V, W>): ReadableStore<W>;
export function encode<V, W>(store: Store<V>, encoder: Encoder<V, W>): Store<W> {
  // async function query(query: Query): Promise<W> {
  //   return null;
  //   // const result = await store.query(query);
  //   // const encoded = encoder.encode(result);
  //   // return encoded;
  // }
  //
  // async function filter(): Promise<W[]> {
  //   return null;
  // }
  //
  // async function getValues(): Promise<string[]> {
  //   return null;
  // }

  if (!isMutableStore<V>(store)) return readOnly(store);

  const add = async (data: W): Promise<W> => {
    const decoded = await encoder.decode(data);
    const encoded = await encoder.encode(await store.add(decoded));
    return encoded;
  }

  const remove = async (data: W): Promise<W> => {
    const decoded = await encoder.decode(data);
    const encoded = await encoder.encode(await store.remove(decoded));
    return encoded;
  }

  return {
    ...readOnly(store),
    add,
    remove,
  };
};

export default Store;
