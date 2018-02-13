import test from 'ava';
import Ontology from '../dist/ontology';


test('it exists', t => {
  t.not(Ontology, undefined);
});

test('it works', async t => {
  const quads = [
    { subject: 'http://bla', predicate: 'http://blabla', object: '"bla"' }
  ];

  const ontology = await Ontology.fromQuads(quads);
  t.not(ontology, undefined);

  const res = await Ontology.classes(ontology);
  t.deepEqual(res, []);
});

const nquads = `@prefix : <http://bla/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix oa: <http://www.w3.org/ns/oa#> .

:Tag
  a owl:Class ;
  rdfs:subClassOf oa:SemanticTag .

:document
  a owl:DatatypeProperty ;
  rdfs:domain :Tag ;
  rdfs:range :Document ;
  owl:inverseOf :tag .

:entity
  a owl:DatatypeProperty ;
  rdfs:domain :Tag ;
  rdfs:range :Entity ;
  owl:inverseOf :tag .

:score
  a owl:DatatypeProperty, owl:FunctionalProperty ;
  rdfs:domain :Tag ;
  rdfs:range xsd:decimal .
`;

test('Ontology.classes: get class iris', async t => {
  const ontology = await Ontology.fromNQuads(nquads);
  t.not(ontology, undefined);

  const res = await Ontology.classes(ontology);
  t.deepEqual(res, [
    'http://bla/Tag',
    'http://www.w3.org/ns/oa#SemanticTag',
  ]);
});
