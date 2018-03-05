import {
  graphql,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} from 'graphql';

import SemanticGraph = require('semantic-graphql');
import * as semtools from 'semantic-toolkit';

import { StoreInterface } from '.';
import { Ontology } from '../ontology';
import { Store, ReadableStore } from '../store';
import { Quad, JSONLD } from '../data';

export type _SemanticGraph = {
  getObjectType(iri: string): GraphQLObjectType
};

export type GraphQLInterface = StoreInterface<Quad, GraphQLSchema>;

export async function create(ontology: Ontology, store: Store<Quad>): Promise<GraphQLInterface> {
  return await createSchema(ontology, store);
};

export function makeResolvers(store: ReadableStore) {
  return {
    resolveSourceId: (source) => source.id,
    resolveResource: (id) => ({ id }),
    resolveResources: (ids) => ids.map(id => ({ id })),
    resolveSourcePropertyValue: async (source, iri) => {
      return store.getPropertyValue(source.id, iri);
    },
    resolveSourceTypes: (source) => {
      return store.getPropertyValue(source.id, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    },
    resolveResourcesByPredicate: async (types, predicate, value) => {
      return store.findBy(types, predicate, value);
    },
  };
}

export async function makeFields(ontology: Ontology, graph: _SemanticGraph): Promise<any> {
  const classes = await Ontology.classes(ontology);
  const lowerCaseFirst = (str: string): string => {
    return str[0].toLowerCase() + str.slice(1, str.length);
  };

  // Expose class as a type so things rdfs:Class is queryable
  return ["http://www.w3.org/2000/01/rdf-schema#Class"].concat(classes).reduce((memo, iri) => {
    const name = semtools.getLocalName(iri);
    return {
      ...memo,
      [lowerCaseFirst(name)]: {
        args: {
          id: { type: new GraphQLList(GraphQLString) },
        },
        type: new GraphQLList(graph.getObjectType(iri)),
        resolve: (source, args, context) => {
          return "id" in args ? args.id.reduce((memo, id) => {
            console.log()
            return [].concat({
              id,
            }, memo);
          }, []) : null;
        }
      }
    };
  }, {});
}

export async function createSchema(ontology: Ontology, store: Store<Quad>): Promise<GraphQLSchema> {
  const resolvers = makeResolvers(store);
  const graph: _SemanticGraph = new SemanticGraph(resolvers, { relay: false });
  const fields = await makeFields(ontology, graph);

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: fields
    })
  });
}

export default create;
