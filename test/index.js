import test from 'ava';
import ontopic from '../dist';

test('it exists', t => {
  t.is(typeof ontopic, 'function');
});

test('it has a default mode', t => {
  const res = ontopic();
  t.not(res, undefined);
});
