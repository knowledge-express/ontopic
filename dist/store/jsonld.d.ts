import Query from '../query';
import { JSONLD } from '../data';
import { MutableStore } from '.';
export declare type Graph = {
    byId: {
        [key: string]: JSONLD.Document;
    };
    other: JSONLD.Document[];
};
export declare function create(): MutableStore<JSONLD.Document>;
export declare function query(graph: Graph, query: Query): Promise<any>;
export declare function add(graph: Graph, data: JSONLD.Document): JSONLD.Document;
export declare function remove(graph: Graph, data: JSONLD.Document): JSONLD.Document;
declare const _default: {
    create: typeof create;
    query: typeof query;
    add: typeof add;
    remove: typeof remove;
};
export default _default;
