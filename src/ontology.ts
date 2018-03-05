import * as n3 from 'n3';
import * as rdfTools from 'rdf-tools';

import { Quad } from './data';
import { MutableStore } from './store';
import EphemeralStore from './store/ephemeral';

export type Graph = {
  match(subject?: string, predicate?: string, object?: string): Quad[]
  add(triple: object): void
  remove(triple: object): void
  toArray(): Quad[]
};

export type Ontology = EphemeralStore & {

};

export module Ontology {
  export async function classes(ontology: Ontology): Promise<string[]> {
    const turtle = toNQuads(ontology);
    // TODO: Remove dependency on rdf-tools for this. Might still be used for other things
    const { classes } = await rdfTools.getClasses(turtle)
    const iris = Object.keys(classes.reduce((memo, c) => {
      return [ c.iri, ...c.subClasses, ...c.superClasses , ...memo ];
    }, []).reduce((memo, iri) => ({ ...memo, [iri]: true }),{}));

    return iris;
  };

  export function fromQuads(quads: Quad[]): Ontology {
    const ontology = EphemeralStore.create();

    ontology.add(quads);

    return ontology;
  };

  export function toQuads(ontology: Ontology): Quad[] {
    const quads = ontology.graph.toArray();
    return quads;
  };

  export function fromNQuads(str: string): Ontology {
    const parser = n3.Parser();
    const triples: Array<n3.Triple> = <any>parser.parse(str, null); // Explicitly pass null as a callback to satisfy the types
    return fromQuads(triples);
  };

  export function toNQuads(ontology: Ontology): string {
    const quads = toQuads(ontology);
    const nquads = Quad.toNQuads(quads);
    return nquads;
  };
};

export default Ontology;
