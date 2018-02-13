"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n3 = require("n3");
var Ontology;
(function (Ontology) {
    function fromString(str) {
        const parser = n3.Parser();
        const triples = parser.parse(str, null);
        return null;
    }
    Ontology.fromString = fromString;
})(Ontology = exports.Ontology || (exports.Ontology = {}));
;
exports.default = Ontology;
