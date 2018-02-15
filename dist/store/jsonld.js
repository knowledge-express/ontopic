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
const jsonld_1 = require("jsonld");
function create() {
    const graph = {
        byId: {},
        other: []
    };
    return {
        add: (data) => add(graph, data),
        remove: (data) => remove(graph, data),
        query: (q) => query(graph, q),
        getValues: null,
        filter: null,
    };
}
exports.create = create;
;
function query(graph, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const _graph = [...Object.keys(graph.byId).map(key => graph.byId[key]), ...graph.other];
        const framed = yield jsonld_1.promises.frame(_graph, query);
        return framed['@graph'][0];
    });
}
exports.query = query;
function add(graph, data) {
    if ('@id' in data)
        graph.byId[data['@id']] = data;
    else
        graph.other.push(data);
    return data;
}
exports.add = add;
;
function remove(graph, data) {
    if ('@id' in data)
        delete graph.byId[data['@id']];
    else {
        throw new Error('Not implemented.');
    }
    return data;
}
exports.remove = remove;
;
exports.default = {
    create,
    query,
    add,
    remove
};
