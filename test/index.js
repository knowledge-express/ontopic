import test from 'ava';
import ontopic from '../dist';

test('it exists', t => {
  t.is(typeof ontopic, 'function');
});

test('it sends updates when writing to the store', async t => {
  const ontop = ontopic();

  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  let _resolve, _reject;
  const resultPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  ontop.bus.observable.subscribe({
    onNext: (value) => _resolve(value)
  })

  const added = await ontop.store.add(quads);
  t.deepEqual(added, quads);

  const operation = await resultPromise;
  t.deepEqual(operation, { action: 'add', data: quads });
});

test('it updates the store when receiving update requests', async t => {
  const ontop = ontopic();

  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  let _resolve, _reject;
  const resultPromise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  ontop.bus.observable.subscribe({
    onNext: (value) => _resolve(value)
  });

  ontop.bus.subject.onNext({ action: 'add', data: quads });

  const operation = await resultPromise;
  t.deepEqual(operation, { action: 'add', data: quads });
});
