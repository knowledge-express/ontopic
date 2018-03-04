import { Quad } from '.';
export declare type JSONLD = JSONLD.Document;
export declare module JSONLD {
    type Token = string | string[] | object | object[];
    type Document = {
        "@id"?: string;
        "@type"?: string | string[];
        "@context"?: Context;
        "@graph": Document[];
        [key: string]: Token;
    };
    type ContextToken = string | object;
    type Context = ContextToken | {
        "@context": ContextToken;
    } | (ContextToken | {
        "@context": ContextToken;
    })[];
    type Frame = Document;
    function compare(a: Document, b: Document, context?: Context): Promise<number>;
    function isComplete(doc: Document, requiredIds?: Quad.IRI[]): boolean;
    function hasDefinedValues(token: string | object): boolean;
    function ids(doc: Document): Quad.IRI[];
    function toQuads(doc: Document): Promise<Quad[]>;
    function fromQuads(quads: Quad[]): Promise<Document>;
    function compact(doc: Document, context: Context): Promise<Document>;
    function expand(doc: Document, context: Context): Promise<Document>;
    function flatten(doc: Document, context: Context): Promise<Document[]>;
    function frame(graph: Document[], frame: Frame): Promise<Document[]>;
}
export default JSONLD;
