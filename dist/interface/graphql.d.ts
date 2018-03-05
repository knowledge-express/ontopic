import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { StoreInterface } from '.';
import { Ontology } from '../ontology';
import { Store, ReadableStore } from '../store';
import { Quad, JSONLD } from '../data';
export declare type _SemanticGraph = {
    getObjectType(iri: string): GraphQLObjectType;
};
export declare type GraphQLInterface = StoreInterface<Quad, GraphQLSchema>;
export declare function create(ontology: Ontology, store: Store<Quad>): Promise<GraphQLInterface>;
export declare function makeResolvers(store: ReadableStore): {
    resolveSourceId: (source: any) => any;
    resolveResource: (id: any) => {
        id: any;
    };
    resolveResources: (ids: any) => any;
    resolveSourcePropertyValue: (source: any, iri: any) => Promise<JSONLD.Token>;
    resolveSourceTypes: (source: any) => JSONLD.Token;
    resolveResourcesByPredicate: (types: any, predicate: any, value: any) => Promise<JSONLD.Token>;
};
export declare function makeFields(ontology: Ontology, graph: _SemanticGraph): Promise<any>;
export declare function createSchema(ontology: Ontology, store: Store<Quad>): Promise<GraphQLSchema>;
export default create;
