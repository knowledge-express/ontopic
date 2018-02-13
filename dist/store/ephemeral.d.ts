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
    create: typeof create;
    query: typeof query;
    add: typeof add;
    remove: typeof remove;
};
export default _default;
