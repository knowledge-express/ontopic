import { Quad } from '../data';
import { MutableBus, Mutation } from '.';

import { Observable, Observer, Subject } from './observable';

// export function create(updater?: (subject: Subject<Mutation<Quad[]>>) => void): MutableBus<Quad[]>;
export function create<V>(updater?: (subject: Subject<Mutation<V>>) => void): MutableBus<V> {
  const observable = Observable.create(updater);
  const subject = Subject.create<Mutation<V>>();

  return {
    observable,
    subject
  };
};

export default {
  create
};
