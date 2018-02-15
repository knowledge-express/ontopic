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
const _1 = require(".");
var JSONLD;
(function (JSONLD) {
    function compare(a, b, context = { "@context": [] }) {
        return __awaiter(this, void 0, void 0, function* () {
            const expandedA = yield expand(a, context);
            const expandedB = yield expand(b, context);
            const quadsA = yield toQuads(expandedA);
            const quadsB = yield toQuads(expandedB);
            const sortedQuadsA = quadsA.sort(_1.Quad.compare);
            const sortedQuadsB = quadsB.sort(_1.Quad.compare);
            const nquadsA = _1.Quad.toNQuads(sortedQuadsA);
            const nquadsB = _1.Quad.toNQuads(sortedQuadsB);
            return nquadsA.localeCompare(nquadsB);
        });
    }
    JSONLD.compare = compare;
    function isComplete(doc, requiredIds) {
        console.log('Checking completeness of doc against:', requiredIds);
        if (!hasDefinedValues(doc))
            return false;
        const docIds = ids(doc);
        const docIdsIndex = docIds.reduce((memo, id) => (Object.assign({}, memo, { [id]: true })), {});
        const missingId = requiredIds.find((key) => {
            return !(key in docIdsIndex);
        });
        const hasRequiredIds = missingId == null;
        return hasDefinedValues(doc) && hasRequiredIds;
    }
    JSONLD.isComplete = isComplete;
    function hasDefinedValues(token) {
        if (typeof token !== 'object' || token == null)
            return false;
        if (token instanceof Array)
            return token.reduce((memo, v) => {
                return memo && hasDefinedValues(v);
            }, true);
        return Object.keys(token).reduce((memo, key) => {
            const value = token[key];
            if (typeof value != 'object')
                return memo && value != null;
            if (value instanceof Array)
                return value.reduce((memo, v) => {
                    return memo && hasDefinedValues(v);
                }, true);
            return memo && hasDefinedValues(value);
        }, true);
    }
    JSONLD.hasDefinedValues = hasDefinedValues;
    function ids(doc) {
        return Object.keys(doc).reduce((memo, key) => {
            const value = doc[key];
            if (key === "@id")
                memo.push(value);
            if (typeof value != 'object' || value == null)
                return memo;
            if (value instanceof Array)
                return [].concat(value).reduce((memo, v) => {
                    if (typeof value === 'string')
                        return memo;
                    return [...memo, ...ids(v)];
                }, memo);
            return [...memo, ...ids(value)];
        }, []);
    }
    JSONLD.ids = ids;
    function toQuads(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const nquads = yield jsonld_1.promises.toRDF(doc, { format: 'application/nquads' });
            const quads = _1.Quad.fromNQuads(nquads);
            return quads;
        });
    }
    JSONLD.toQuads = toQuads;
    function fromQuads(quads) {
        return __awaiter(this, void 0, void 0, function* () {
            const nquads = _1.Quad.toNQuads(quads);
            const doc = yield jsonld_1.promises.fromRDF(nquads);
            return doc;
        });
    }
    JSONLD.fromQuads = fromQuads;
    function compact(doc, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield jsonld_1.promises.compact(yield expand(doc, context), context);
            delete res["@context"];
            return res;
        });
    }
    JSONLD.compact = compact;
    function expand(doc, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return [].concat(jsonld_1.promises.expand({ "@context": context, "@graph": doc }))[0];
        });
    }
    JSONLD.expand = expand;
    function flatten(doc, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const expanded = yield expand(yield compact(doc, context), context);
            const quads = yield toQuads(expanded);
            const strippedOfLabel = quads.map(({ subject, predicate, object }) => ({ subject, predicate, object }));
            const strippedDoc = yield fromQuads(strippedOfLabel);
            const flattened = yield jsonld_1.promises.flatten(strippedDoc);
            const compacted = Promise.all(flattened.map(doc => compact(doc, context)));
            return compacted;
        });
    }
    JSONLD.flatten = flatten;
    function frame(graph, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            const flattened = yield flatten({ "@graph": graph }, frame["@context"]);
            const expanded = yield Promise.all(flattened.map(doc => expand(doc, frame["@context"])));
            const framed = yield jsonld_1.promises.frame(expanded, frame);
            return [].concat(framed["@graph"]);
        });
    }
    JSONLD.frame = frame;
})(JSONLD = exports.JSONLD || (exports.JSONLD = {}));
;
exports.default = JSONLD;
