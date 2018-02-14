import test from 'ava';
import JSONLD from '../../dist/data/jsonld';

// import { promises as jsonld } from 'jsonld';

test('it exists', t => {
  t.not(JSONLD, undefined);
});

test('fromQuads: it encodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const res = await JSONLD.fromQuads(quads);
  t.deepEqual(res, doc);
});

test('toQuads: it decodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const res = await JSONLD.toQuads(doc);
  t.deepEqual(res, quads);
});
