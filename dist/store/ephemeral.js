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
const rdf = require("rdf");
const jsonld_1 = require("jsonld");
const data_1 = require("../data");
function create() {
    const graph = new rdf.Graph;
    return {
        add: (data) => add(graph, data),
        remove: (data) => remove(graph, data),
        query: (q) => query(graph, q)
    };
}
exports.create = create;
;
function query(graph, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const quads = graph.toArray();
        const nquads = data_1.Quad.toNQuads(quads);
        const doc = yield jsonld_1.promises.fromRDF(nquads);
        const framed = yield jsonld_1.promises.frame(doc, query);
        const resultNQuads = yield jsonld_1.promises.toRDF(framed, { format: 'application/nquads' });
        const resultQuads = data_1.Quad.fromNQuads(resultNQuads).reverse();
        return resultQuads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
    });
}
exports.query = query;
function add(graph, data) {
    return data.map(quad => {
        const { subject, predicate, object } = quad;
        graph.add(rdf.environment.createTriple(subject, predicate, object));
        return quad;
    });
}
exports.add = add;
;
function remove(graph, data) {
    return data.map(quad => {
        const { subject, predicate, object } = quad;
        graph.remove(rdf.environment.createTriple(subject, predicate, object));
        return quad;
    });
}
exports.remove = remove;
;
exports.default = {
    query,
    add,
    remove
};
