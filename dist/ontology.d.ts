import { Quad } from './data';
import EphemeralStore from './store/ephemeral';
export declare type Graph = {
    match(subject?: string, predicate?: string, object?: string): Quad[];
    add(triple: object): void;
    remove(triple: object): void;
    toArray(): Quad[];
};
export declare type Ontology = EphemeralStore & {};
export declare module Ontology {
    function classes(ontology: Ontology): Promise<string[]>;
    function fromQuads(quads: Quad[]): Ontology;
    function toQuads(ontology: Ontology): Quad[];
    function fromNQuads(str: string): Ontology;
    function toNQuads(ontology: Ontology): string;
}
export default Ontology;
