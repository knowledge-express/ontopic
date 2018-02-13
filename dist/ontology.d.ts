import { Quad } from './data';
import Store from './store';
export declare type Ontology = {
    store: Store<any>;
};
export declare module Ontology {
    function classes(ontology: Ontology): Promise<string[]>;
    function fromQuads(quads: Quad[]): Promise<Ontology>;
    function toQuads(ontology: Ontology): Promise<Quad[]>;
    function fromNQuads(str: string): Promise<Ontology>;
    function toNQuads(ontology: Ontology): Promise<string>;
}
export default Ontology;
