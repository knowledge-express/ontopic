export declare type Quad = {
    subject: Quad.IRI;
    predicate: Quad.IRI;
    object: Quad.IRI | string;
    label?: Quad.IRI;
};
export declare module Quad {
    type NQuads = string;
    type Literal = string;
    type IRI = string;
    function encodeRDF(str: string): string;
    function isIRI(str: string): str is IRI;
    function isURI(str: string): boolean;
    function isLiteral(str: string): str is Literal;
    function encodeIRI(iri: IRI): string;
    function encodeLiteral(literal: Literal): string;
    function isQuad(quad: object): quad is Quad;
    function compare(a: Quad, b: Quad): number;
    function fromNQuads(nquads: NQuads): Quad[];
    function toNQuads(quads: Quad[]): NQuads;
}
export default Quad;
