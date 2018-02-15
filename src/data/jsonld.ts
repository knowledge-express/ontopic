import { promises as jsonld } from 'jsonld';

import { Quad } from '.';


// TODO: Make this optionally plural
export type JSONLD = JSONLD.Document;

export module JSONLD {
  export type Token = string | string[] | object | object[];
  export type Document = {
    "@id"?: string,
    "@type"?: string | string[],
    "@context"?: Context,
    "@graph": Document[],
    [key: string]: Token
  };
  export type ContextToken = string | object;
  export type Context = ContextToken | { "@context": ContextToken } | (ContextToken | { "@context": ContextToken })[];
  export type Frame = Document;

  export async function compare(a: Document, b: Document, context: Context = { "@context": [] }): Promise<number> {
    // Expanding factors out the context
    const expandedA = await expand(a, context);
    const expandedB = await expand(b, context);

    // Quads can be sorted
    const quadsA = await toQuads(expandedA);
    const quadsB = await toQuads(expandedB);

    const sortedQuadsA = quadsA.sort(Quad.compare);
    const sortedQuadsB = quadsB.sort(Quad.compare);

    // String can be easily compared
    const nquadsA = Quad.toNQuads(sortedQuadsA);
    const nquadsB = Quad.toNQuads(sortedQuadsB);

    return nquadsA.localeCompare(nquadsB);
  }

  export function isComplete(doc: Document, requiredIds: Quad.IRI[]): boolean {
    console.log('Checking completeness of doc against:', requiredIds);
    if (!hasDefinedValues(doc)) return false;
    const docIds = ids(doc);
    const docIdsIndex = docIds.reduce((memo, id) => ({ ...memo, [id]: true}), {});
    const missingId = requiredIds.find((key) => {
      return !(key in docIdsIndex);
    });
    const hasRequiredIds = missingId == null;

    return hasDefinedValues(doc) && hasRequiredIds;
  }

  export function hasDefinedValues(token: string | object): boolean {
    if (typeof token !== 'object' || token == null) return false;
    if (token instanceof Array) return token.reduce((memo, v) => {
      return memo && hasDefinedValues(v);
    }, true);

    return Object.keys(token).reduce((memo, key) => {
      const value = token[key]

      if (typeof value != 'object') return memo && value != null;
      if (value instanceof Array) return value.reduce((memo: boolean, v: string | object) => {
        return memo && hasDefinedValues(v);
      }, true);

      return memo && hasDefinedValues(value);
    }, true);
  }

  export function ids(doc: Document): Quad.IRI[] {
    if (typeof doc !== 'object' || doc == null) return [];
    return Object.keys(doc).reduce((memo, key) => {
      const value = doc[key];
      if (key === "@id") memo.push(value);

      if (typeof value != 'object' || value == null) return memo;
      if (value instanceof Array) return [].concat(value).reduce<Quad.IRI[]>((memo, v) => {
        if (typeof value === 'string') return memo;
        return [ ...memo, ...ids(v) ];
      }, memo);

      return [ ...memo, ...ids(<Document>value) ];
    }, []);
  }

  export async function toQuads(doc: Document): Promise<Quad[]> {
    const nquads = await jsonld.toRDF(doc, { format: 'application/nquads' });
    const quads = Quad.fromNQuads(nquads);
    return quads;
  }

  export async function fromQuads(quads: Quad[]): Promise<Document> {
    const nquads = Quad.toNQuads(quads);
    const doc = await jsonld.fromRDF(nquads);
    return doc;
  }

  export async function compact(doc: Document, context: Context): Promise<Document> {
    const res = await jsonld.compact(await expand(doc, context), context);

    // Here we strip the context from the compacted result
    delete res["@context"];

    return res;
  }

  export async function expand(doc: Document, context: Context): Promise<Document> {
    return [].concat(jsonld.expand({ "@context": context, "@graph": doc }))[0];
  }

  export async function flatten(doc: Document, context: Context): Promise<Document[]> {
    const expanded = await expand(await compact(doc, context), context);
    const quads = await toQuads(expanded);

    // TODO: We strip the labels here because it makes flattening difficult. We shouldn't really, but it's fine for now
    const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
    const strippedDoc = await fromQuads(strippedOfLabel);

    const flattened: Document[] = await jsonld.flatten(strippedDoc);
    const compacted = Promise.all(flattened.map(doc => compact(doc, context)));

    return compacted;
  }

  export async function frame(graph: Document[], frame: Frame): Promise<Document[]> {
    const flattened = await flatten({ "@graph": graph }, frame["@context"]);
    const expanded = await Promise.all(flattened.map(doc => expand(doc, frame["@context"])));
    const framed = await jsonld.frame(expanded, frame);
    return [].concat(framed["@graph"]);
  }
};

export default JSONLD;
