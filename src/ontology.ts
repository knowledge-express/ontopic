import * as n3 from 'n3';

import Store from './store';

export type Ontology = {
  store: Store<any>
};

export module Ontology {

  export function fromString(str: string): Ontology {
    const parser = n3.Parser();
    const triples: Array<n3.Triple> = <any>parser.parse(str, null); // Explicitly pass null as a callback to satisfy the types
    return null;
    // return triples;
  }

};

export default Ontology;
