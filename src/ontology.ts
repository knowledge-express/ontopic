import * as n3 from 'n3';
import * as rdfTools from 'rdf-tools';

import { Quad } from './data';
import Store from './store';
import * as EphemeralStore from './store/ephemeral';

export type Ontology = {
  store: Store<any>
};

export module Ontology {
  export async function classes(ontology: Ontology): Promise<string[]> {
    const turtle = await toNQuads(ontology);
    // TODO: Remove dependency on rdf-tools for this. Might still be used for other things
    const { classes } = await rdfTools.getClasses(turtle)
    const iris = Object.keys(classes.reduce((memo, c) => {
      return [ c.iri, ...c.subClasses, ...c.superClasses , ...memo ];
    }, []).reduce((memo, iri) => ({ ...memo, [iri]: true }),{}));

    return iris;
  };

  export async function fromQuads(quads: Quad[]): Promise<Ontology> {
    const store = EphemeralStore.create();
    await store.add(quads);

    return {
      store
    };
  };

  export async function toQuads(ontology: Ontology): Promise<Quad[]> {
    return ontology.store.query({});
  };

  export async function fromNQuads(str: string): Promise<Ontology> {
    const parser = n3.Parser();
    const triples: Array<n3.Triple> = <any>parser.parse(str, null); // Explicitly pass null as a callback to satisfy the types
    return fromQuads(triples);
  };

  export async function toNQuads(ontology: Ontology): Promise<string> {
    const quads = await toQuads(ontology);
    const nquads = Quad.toNQuads(quads);
    return nquads;
  };
};

export default Ontology;
