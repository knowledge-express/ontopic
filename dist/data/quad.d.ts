export declare function iriify(str: string): string;
export declare function encodeRDF(str: string): string;
export declare function isURI(str: string): any;
export declare function isLiteral(str: string): boolean;
export declare function encodeLiteral(str: any): string;
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
    function toNQuads(quads: Quad[]): NQuads;
}
