import test from 'ava';
import ontopic from '../dist';

test('it exists', t => {
  t.is(typeof ontopic, 'function');
});
