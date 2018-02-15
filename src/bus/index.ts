import { promises as jsonld } from 'jsonld';

import { Observable, Subject } from './observable';

import { Encoder, Mutation, JSONLD } from '../data';
import * as Store from '../store';
import * as JSONLDStore from '../store/jsonld';

import Query from '../query';

import * as EphemeralBus from './ephemeral';

export * from './observable';
export { EphemeralBus };

export type ReadableBus<V> = {
  observable: Observable<V>
};

export type MutableBus<V> = ReadableBus<V> & {
  subject: Subject<V>
};

export type Bus<V> = ReadableBus<V> | MutableBus<V>;

export function isBus<V>(obj: object): obj is Bus<V> {
  // Every bus should be readable, but nevermind the fallback
  return isReadableBus(obj) || isMutableBus(obj);
};

export function isReadableBus<V>(obj: object): obj is ReadableBus<V> {
  return typeof obj === 'object' && 'observable' in obj;
};

export function isMutableBus<V>(obj: object): obj is MutableBus<V> {
  return isReadableBus<V>(obj) && 'subject' in obj;
};

export function readOnly<V>(bus: Bus<V>): ReadableBus<V> {
  return {
    observable: bus.observable
  };
};

export function map<V, W>(bus: Bus<V>, mapFn: (v: V) => W | Promise<W>): Bus<W> {
  const mappedUpdates = Observable.map(bus.observable, mapFn);
  if (!isMutableBus(bus)) return { observable: mappedUpdates };

  const mapedUpdateRequests = Subject.create<W>();
  Observable.map(bus.subject, mapFn).subscribe(mapedUpdateRequests);

  return {
    observable: mappedUpdates,
    subject: mapedUpdateRequests
  };
};

export function flatten<V>(bus: Bus<V[]>): Bus<V> {
  const flattenedUpdates = Observable.flatten(bus.observable);
  if (!isMutableBus(bus)) return { observable: flattenedUpdates };

  const flattenedUpdateRequests = Subject.create<V>();

  Observable.flatten(bus.subject).subscribe(flattenedUpdateRequests);

  return {
    observable: flattenedUpdates,
    subject: flattenedUpdateRequests
  };
};

export function encode<V, W>(bus: Bus<Mutation<V>>, encoder: Encoder<V, W>): Bus<Mutation<W>> {
  return map(bus, async mutation => Mutation.map(mutation, encoder.encode));
  // const encodedUpdates = Observable.map(bus.observable, mapMutation);
  //
  // if (!isMutableBus(bus)) return { observable: encodedUpdates };
  //
  // const encodedUpdateRequests = Subject.create<Mutation<W>>();
  // Observable.map(bus.subject, mapMutation).subscribe(encodedUpdateRequests);
  //
  // return {
  //   observable: encodedUpdates,
  //   subject: encodedUpdateRequests
  // }
};

// TODO: Figure out what to do with updateRequests
export async function frame(bus: Bus<Mutation<JSONLD.Document>>, frame: JSONLD.Frame): Promise<ReadableBus<Mutation<JSONLD.Document>>> {
  console.log('Expanding frame');
  const expanded = await jsonld.expand(frame);
  console.log('Flattening frame');
  // This should give us graph with a frame for each nested type of document
  const flattened: JSONLD.Document[] = await jsonld.flatten(expanded);

  console.log('Building type index');
  const typeIndex = flattened.reduce((memo, frame) => {
    const types = [].concat(frame["@type"] || []);
    return types.reduce((memo, type) => ({ ...memo, [type]: frame }), memo);
  }, {});

  const framedUpdates = Subject.create<Mutation<JSONLD.Document>>();

  console.log('Filtering by types:', Object.keys(typeIndex));
  // Filter by types that might be interesting to the frame
  const filtered = Observable.filter(bus.observable, mutation => {
    console.log('Filtering mutation based on types.');
    const { data } = mutation;
    const types = [].concat(data["@type"] || []);
    const hasType: boolean = types.reduce((memo, type) => memo || type in typeIndex, false);
    console.log('Has type?', hasType);
    return hasType;
  });

  console.log('Creating cache');
  const cache = JSONLDStore.create();
  const idsByDocId = {};
  const framed = Observable.map(filtered, async (mutation) => {
    const { action, data } = mutation;
    console.log('Applying mutation to cache:', action, data);


    // Apply mutation to cache
    const result = await cache[action](data);
    const docIds = JSONLD.ids(result);
    const docId = result["@id"];
    idsByDocId[docId] = docIds;

    const framed = await cache.query(frame);
    return { action, data: framed };
  });

  // const flattened = Observable.flatten(framed);

  // Filter by completion
  const completed = Observable.filter(framed, mutation => {
    const { data } = mutation
    const framedIds = JSONLD.ids(data);
    const requiredIds = framedIds.reduce((memo, id) => {
      const docIds = idsByDocId[id];
      return [ ...memo, ...docIds ];
    }, []);
    const result = JSONLD.isComplete(data, []);
    console.log('Filtering on completeness:', result, mutation);
    return result;
  });

  // Clean up the cache
  const removedFromCache = Observable.map(completed, async mutation => {
    const { action, data } = mutation

    // Removed complete frame from cache
    await cache.remove(data);

    return mutation;
  });

    // console.log('Subscribing.');
  removedFromCache.subscribe(framedUpdates);

  return { observable: framedUpdates };
};

//
// export function query<V>(bus: Bus<V>, query: Query) {
//   return
// }
//
// export function pipe<V>(bus: Bus<V>, destination: MutableBus<V>): Bus<V> {
//   bus.observable.subscribe(destination.subject)
// };

// export function connect<V>(bus: MutableBus<V>, store: Store.MutableStore<V>): MutableBus<V> {
//   const updatesObservable = Observable.map(bus.subject, async mutation => {
//     const { action, data } = mutation;
//     const result = await store[action](data);
//     return { action, data: result };
//   });
//
//   const merged = Observable.create<Mutation<V>>((subject) => {
//     bus.observable.subscribe(subject);
//     updatesObservable.subscribe(subject);
//   });
//
//   return {
//     observable: merged,
//     subject: bus.subject
//   }
// };

export default Bus;
