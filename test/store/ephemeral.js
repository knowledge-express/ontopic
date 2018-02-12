import test from 'ava';
import * as EphemeralStore from '../../dist/store/ephemeral';

test('it exists', t => {
  t.not(EphemeralStore, undefined);
});

test('it works', async t => {
  const store = EphemeralStore.create();
  t.not(store, undefined);

  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const added = await store.add(quads);
  t.deepEqual(added, quads);

  const res = await store.query({});
  t.deepEqual(res, quads);
});
