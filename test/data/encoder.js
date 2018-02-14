import test from 'ava';
import Encoder from '../../dist/data/encoder';

// import { promises as jsonld } from 'jsonld';

test('it exists', t => {
  t.not(Encoder, undefined);
});

test('JSONLDToQuads: it encodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const encoder = Encoder.JSONLDToQuads();
  const res = await encoder.encode(doc);
  t.deepEqual(res, quads);
});

test('JSONLDToQuads: it decodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const encoder = Encoder.JSONLDToQuads();
  const res = await encoder.decode(quads);
  t.deepEqual(res, doc);
});

test('quadsToJSONLD: it encodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const encoder = Encoder.quadsToJSONLD();
  const res = await encoder.encode(quads);
  t.deepEqual(res, doc);
});

test('quadsToJSONLD: it decodes', async t => {
  const doc = [{"@id":"http://bla","http://blabla":[{"@value":"bla"}]}];
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const encoder = Encoder.quadsToJSONLD();
  const res = await encoder.decode(doc);
  t.deepEqual(res, quads);
});
