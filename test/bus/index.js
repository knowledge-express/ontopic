import test from 'ava';
import * as Bus from '../../dist/bus';
// import JSONLD from '../../dist/data/jsonld';

// const videoFlattenedExpanded = require('../support/video-flattened-expanded');
// const complexFrame = {
//   "@explicit": true,
//   "@type": "https://knowledge.express/Resource",
//   "https://knowledge.express/caption": {
//     "@explicit": true,
//     "@type": "https://knowledge.express/VideoCaption"
//   }
// };
//
// const complexFramed = require('../support/video-framed');

test('it exists', t => {
  t.not(Bus, undefined);
});

// const frame = {
//   "@context": {
//     "dc": "http://purl.org/dc/elements/1.1/",
//     "ex": "http://example.org/vocab#"
//   },
//   "@type": "ex:Library",
//   "ex:contains": {
//     "@type": "ex:Book",
//     "ex:contains": {
//       "@type": "ex:Chapter"
//     }
//   }
// };
//
// const framed = {
//   "@id": "http://example.org/library",
//   "@type": "ex:Library",
//   "ex:contains": {
//     "@id": "http://example.org/library/the-republic",
//     "@type": "ex:Book",
//     "ex:contains": {
//       "@id": "http://example.org/library/the-republic#introduction",
//       "@type": "ex:Chapter",
//       "dc:description": "An introductory chapter on The Republic.",
//       "dc:title": "The Introduction"
//     },
//     "dc:creator": "Plato",
//     "dc:title": "The Republic"
//   }
// };
//
// const docs = [
//   {
//     "@id": "http://example.org/library",
//     "@type": "http://example.org/vocab#Library",
//     "http://example.org/vocab#contains": {
//       "@id": "http://example.org/library/the-republic"
//     }
//   },
//   {
//     "@id": "http://example.org/library/the-republic",
//     "@type": "http://example.org/vocab#Book",
//     "http://example.org/vocab#contains": {
//       "@id": "http://example.org/library/the-republic#introduction"
//     },
//     "http://purl.org/dc/elements/1.1/creator": "Plato",
//     "http://purl.org/dc/elements/1.1/title": "The Republic"
//   },
//   {
//     "@id": "http://example.org/library/the-republic#introduction",
//     "@type": "http://example.org/vocab#Chapter",
//     "http://purl.org/dc/elements/1.1/description": "An introductory chapter on The Republic.",
//     "http://purl.org/dc/elements/1.1/title": "The Introduction"
//   }
// ];
//
// test('Bus.frame: it frames', async t => {
//   let _resolve, _reject;
//   const resultPromise = new Promise((resolve, reject) => {
//     _resolve = resolve;
//     _reject = reject;
//   });
//
//
//   const updates = Bus.Subject.create();
//   const bus = Bus.EphemeralBus.create((subject) => updates.subscribe(subject));
//   const framedBus = await Bus.frame(bus, frame);
//   console.log(framedBus);
//
//   framedBus.observable.subscribe({
//     onNext: (value) => _resolve(value),
//     onError: error => _reject(error)
//   });
//
//   await docs.reverse().reduce(async (memo, value) => {
//     await memo;
//     console.log('Sending mutation!');
//     return updates.onNext({ action: 'add', data: value });
//   }, Promise.resolve());
//
//
//   const res = await resultPromise;
//
//   return t.deepEqual(res, { action: 'add', data: framed });
// });
//
// test('Bus.frame: it frames complex things', async t => {
//   let _resolve, _reject;
//   const resultPromise = new Promise((resolve, reject) => {
//     _resolve = resolve;
//     _reject = reject;
//   });
//
//
//   const updates = Bus.Subject.create();
//   const bus = Bus.EphemeralBus.create((subject) => updates.subscribe(subject));
//   // const captionIds = complexFramed["https://knowledge.express/caption"].map(c => c["@id"]);
//   let captionIds;
//   const validator = async (doc, mutation) => {
//     if ([].concat(mutation.data["@type"]).indexOf("https://knowledge.express/Resource") !== -1) {
//       captionIds = mutation.data["https://knowledge.express/caption"].map(c => c["@id"]);
//     }
//     if (!captionIds) return false;
//     return JSONLD.isComplete(doc, captionIds);
//   };
//   const framedBus = await Bus.frame(bus, complexFrame, validator);
//   console.log(framedBus);
//
//   framedBus.observable.subscribe({
//     onNext: (value) => _resolve(value),
//     onError: error => _reject(error)
//   });
//
//   await videoFlattenedExpanded.reverse().reduce(async (memo, value) => {
//     await memo;
//     console.log('Sending mutation!');
//     return updates.onNext({ action: 'add', data: value });
//   }, Promise.resolve());
//
//
//   const res = await resultPromise;
//
//   return t.deepEqual(res, { action: 'add', data: complexFramed });
// });
