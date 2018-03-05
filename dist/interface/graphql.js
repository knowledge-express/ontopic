"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const SemanticGraph = require("semantic-graphql");
const semtools = require("semantic-toolkit");
const ontology_1 = require("../ontology");
function create(ontology, store) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield createSchema(ontology, store);
    });
}
exports.create = create;
;
function makeResolvers(store) {
    return {
        resolveSourceId: (source) => source.id,
        resolveResource: (id) => ({ id }),
        resolveResources: (ids) => ids.map(id => ({ id })),
        resolveSourcePropertyValue: (source, iri) => __awaiter(this, void 0, void 0, function* () {
            return store.getPropertyValue(source.id, iri);
        }),
        resolveSourceTypes: (source) => {
            return store.getPropertyValue(source.id, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        },
        resolveResourcesByPredicate: (types, predicate, value) => __awaiter(this, void 0, void 0, function* () {
            return store.findBy(types, predicate, value);
        }),
    };
}
exports.makeResolvers = makeResolvers;
function makeFields(ontology, graph) {
    return __awaiter(this, void 0, void 0, function* () {
        const classes = yield ontology_1.Ontology.classes(ontology);
        const lowerCaseFirst = (str) => {
            return str[0].toLowerCase() + str.slice(1, str.length);
        };
        return ["http://www.w3.org/2000/01/rdf-schema#Class"].concat(classes).reduce((memo, iri) => {
            const name = semtools.getLocalName(iri);
            return Object.assign({}, memo, { [lowerCaseFirst(name)]: {
                    args: {
                        id: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                    },
                    type: new graphql_1.GraphQLList(graph.getObjectType(iri)),
                    resolve: (source, args, context) => {
                        return "id" in args ? args.id.reduce((memo, id) => {
                            console.log();
                            return [].concat({
                                id,
                            }, memo);
                        }, []) : null;
                    }
                } });
        }, {});
    });
}
exports.makeFields = makeFields;
function createSchema(ontology, store) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolvers = makeResolvers(store);
        const graph = new SemanticGraph(resolvers, { relay: false });
        const fields = yield makeFields(ontology, graph);
        return new graphql_1.GraphQLSchema({
            query: new graphql_1.GraphQLObjectType({
                name: 'Query',
                fields: fields
            })
        });
    });
}
exports.createSchema = createSchema;
exports.default = create;
