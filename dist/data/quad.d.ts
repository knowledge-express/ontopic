import * as Helpers from '.';
export declare type NQuads = string;
export declare type Quad = {
    subject: string;
    predicate: string;
    object: string;
    label?: string;
};
export declare module Quad {
    function isQuad(quad: object): quad is Quad;
    function compare(a: Quad, b: Quad): number;
    function fromNQuads(nquads: NQuads): Quad[];
    const toNQuads: (quads: Helpers.Quad[]) => string;
}
