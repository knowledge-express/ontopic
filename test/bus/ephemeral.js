import test from 'ava';
import * as EphemeralBus from '../../dist/bus/ephemeral';

test('it exists', t => {
  t.not(EphemeralBus, undefined);
});

test('it works', async t => {
  const bus = EphemeralBus.create();
  t.not(bus, undefined);

  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  let _resolve, _reject;
  const resultPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  bus.subject.subscribe({
    onNext: (value) => _resolve(value)
  })

  bus.subject.onNext(quads);

  const res = await resultPromise;
  t.deepEqual(res, quads);
});
