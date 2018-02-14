import { Quad } from '.';
export declare type JSONLDToken = string | string[] | object | object[];
export declare type JSONLD = {
    "@id"?: string;
    "@type"?: string | string[];
    [key: string]: JSONLDToken;
};
export declare module JSONLD {
    function toQuads(doc: JSONLD): Promise<Quad[]>;
    function fromQuads(quads: Quad[]): Promise<JSONLD>;
}
export default JSONLD;
