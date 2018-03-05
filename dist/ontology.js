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
const ephemeral_1 = require("./store/ephemeral");
var Ontology;
(function (Ontology) {
    function classes(ontology) {
        return __awaiter(this, void 0, void 0, function* () {
            const turtle = toNQuads(ontology);
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
        const ontology = ephemeral_1.default.create();
        ontology.add(quads);
        return ontology;
    }
    Ontology.fromQuads = fromQuads;
    ;
    function toQuads(ontology) {
        const quads = ontology.graph.toArray();
        return quads;
    }
    Ontology.toQuads = toQuads;
    ;
    function fromNQuads(str) {
        const parser = n3.Parser();
        const triples = parser.parse(str, null);
        return fromQuads(triples);
    }
    Ontology.fromNQuads = fromNQuads;
    ;
    function toNQuads(ontology) {
        const quads = toQuads(ontology);
        const nquads = data_1.Quad.toNQuads(quads);
        return nquads;
    }
    Ontology.toNQuads = toNQuads;
    ;
})(Ontology = exports.Ontology || (exports.Ontology = {}));
;
exports.default = Ontology;
