import { Quad } from '../data';
import { MutableBus } from '.';

import { Observable, Observer, Subject } from './observable';

export type Graph = {
  add: (triple: object) => void
  remove: (triple: object) => void
  toArray: () => any[]
};

export function create(): MutableBus<Quad[]> {
  // We make the observable a subject so the user of this bus can decide to push updates
  // In the Kafka bus, this observable would not be writeable
  const observable = Subject.create();
  const subject = Subject.create();
  
  return {
    observable,
    subject
  };
};

export default {
  create
};
