import { Quad } from '../data';
import { MutableBus } from '.';

import { Observable, Observer, Subject } from './observable';

export function create(updater?: (subject: Subject<Quad[]>) => void): MutableBus<Quad[]> {
  const observable = Observable.create(updater);
  const subject = Subject.create();

  return {
    observable,
    subject
  };
};

export default {
  create
};
