import { promises as jsonld } from 'jsonld';

import { Quad } from '.';

export type JSONLDToken = string | string[] | object | object[];

export type JSONLD = {
  "@id"?: string,
  "@type"?: string | string[],
  [key: string]: JSONLDToken
};

export module JSONLD {
  export async function toQuads(doc: JSONLD): Promise<Quad[]> {
    const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
    const quads = Quad.fromNQuads(nquads);
    return quads;
  };

  export async function fromQuads(quads: Quad[]): Promise<JSONLD> {
    const nquads = Quad.toNQuads(quads);
    const doc = await jsonld.fromRDF(nquads);
    return doc;
  }
};

export default JSONLD;
