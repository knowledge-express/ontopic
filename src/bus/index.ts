import { Observable, Subject } from './observable';

import * as Store from '../store';

import Query from '../query';

export type Mutation<V> = {
  action: 'add' | 'remove'
  data: V
};

export type ReadableBus<V> = {
  observable: Observable<Mutation<V>>
};

export type MutableBus<V> = ReadableBus<V> & {
  subject: Subject<Mutation<V>>
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
  return isReadableBus<V>(obj) && 'observable' in obj;
};

export function readOnly<V>(bus: Bus<V>): ReadableBus<V> {
  return {
    observable: bus.observable
  };
};

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

export function query<V>(bus: Bus<V>, query: Query) {
  return
}

export default Bus;
