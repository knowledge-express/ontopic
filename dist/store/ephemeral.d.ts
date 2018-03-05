import { Quad } from '../data';
import { MutableStore } from '.';
export declare type Graph = {
    match(subject?: string, predicate?: string, object?: string): Quad[];
    add(triple: object): void;
    remove(triple: object): void;
    toArray(): Quad[];
};
export declare type EphemeralStore = MutableStore<Quad[]> & {
    graph: Graph;
};
export declare module EphemeralStore {
    function create(): EphemeralStore;
    function getPropertyValue(store: EphemeralStore, id: any, property: any): Promise<string | Array<string>>;
    function findBy(store: EphemeralStore): Promise<any>;
    function add(store: EphemeralStore, data: Quad[]): Quad[];
    function remove(store: EphemeralStore, data: Quad[]): Quad[];
}
export default EphemeralStore;
