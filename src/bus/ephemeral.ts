import { MutableBus } from '.';

import { Observable, Observer, Subject } from './observable';

export function create<V>(updater?: (subject: Subject<V>) => void): MutableBus<V> {
  const observable = Observable.create(updater);
  const subject = Subject.create<V>();

  return {
    observable,
    subject
  };
};

// This function is useless atm
// export function fromArray<V>(values: V[]): MutableBus<V> {
//   return create<V>(async subject => {
//     await values.reduce(async (memo, value) => {
//       await memo;
//       return subject.onNext(value);
//     }, Promise.resolve());
//
//     subject.onComplete();
//   });
// };

export default {
  create
};
