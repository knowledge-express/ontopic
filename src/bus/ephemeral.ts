import { Quad } from '../data';
import { MutableBus, Mutation } from '.';

import { Observable, Observer, Subject } from './observable';

export function create(updater?: (subject: Subject<Mutation<Quad[]>>) => void): MutableBus<Quad[]> {
  const observable = Observable.create(updater);
  const subject = Subject.create<Mutation<Quad[]>>();

  return {
    observable,
    subject
  };
};

export default {
  create
};
