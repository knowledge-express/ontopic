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
const n3 = require("n3");
const rdfTools = require("rdf-tools");
const data_1 = require("./data");
const EphemeralStore = require("./store/ephemeral");
var Ontology;
(function (Ontology) {
    function classes(ontology) {
        return __awaiter(this, void 0, void 0, function* () {
            const turtle = yield toNQuads(ontology);
            const { classes } = yield rdfTools.getClasses(turtle);
            const iris = Object.keys(classes.reduce((memo, c) => {
                return [c.iri, ...c.subClasses, ...c.superClasses, ...memo];
            }, []).reduce((memo, iri) => (Object.assign({}, memo, { [iri]: true })), {}));
            return iris;
        });
    }
    Ontology.classes = classes;
    ;
    function fromQuads(quads) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = EphemeralStore.create();
            yield store.add(quads);
            return {
                store
            };
        });
    }
    Ontology.fromQuads = fromQuads;
    ;
    function toQuads(ontology) {
        return __awaiter(this, void 0, void 0, function* () {
            return ontology.store.query({});
        });
    }
    Ontology.toQuads = toQuads;
    ;
    function fromNQuads(str) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = n3.Parser();
            const triples = parser.parse(str, null);
            return fromQuads(triples);
        });
    }
    Ontology.fromNQuads = fromNQuads;
    ;
    function toNQuads(ontology) {
        return __awaiter(this, void 0, void 0, function* () {
            const quads = yield toQuads(ontology);
            const nquads = data_1.Quad.toNQuads(quads);
            return nquads;
        });
    }
    Ontology.toNQuads = toNQuads;
    ;
})(Ontology = exports.Ontology || (exports.Ontology = {}));
;
exports.default = Ontology;
