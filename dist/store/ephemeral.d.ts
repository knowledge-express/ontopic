import Query from '../query';
import { Quad } from '../data';
import { MutableStore } from '.';
export declare type Graph = {
    add: (triple: object) => void;
    remove: (triple: object) => void;
    toArray: () => any[];
};
export declare function create(): MutableStore<Quad[]>;
export declare function query(graph: Graph, query: Query): Promise<{
    subject: string;
    predicate: string;
    object: string;
}[]>;
export declare function add(graph: Graph, data: Quad[]): Quad[];
export declare function remove(graph: Graph, data: Quad[]): Quad[];
declare const _default: {
    create: () => MutableStore<Quad[]>;
    query: (graph: Graph, query: object) => Promise<{
        subject: string;
        predicate: string;
        object: string;
    }[]>;
    add: (graph: Graph, data: Quad[]) => Quad[];
    remove: (graph: Graph, data: Quad[]) => Quad[];
};
export default _default;
