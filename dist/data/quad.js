"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n3 = require("n3");
const isuri = require("isuri");
var Quad;
(function (Quad) {
    function encodeRDF(str) {
        if (isURI(str))
            return encodeIRI(str);
        if (isLiteral(str))
            return encodeLiteral(str);
        try {
            JSON.parse(str);
            return str;
        }
        catch (e) {
            return JSON.stringify(str);
        }
    }
    Quad.encodeRDF = encodeRDF;
    function isIRI(str) {
        return isURI(str);
    }
    Quad.isIRI = isIRI;
    function isURI(str) {
        return isuri.isValid(str);
    }
    Quad.isURI = isURI;
    function isLiteral(str) {
        return /\^\^/.test(str);
    }
    Quad.isLiteral = isLiteral;
    function encodeIRI(iri) {
        return `<${iri}>`;
    }
    Quad.encodeIRI = encodeIRI;
    function encodeLiteral(literal) {
        const [value, type] = literal.split("^^");
        return `${value}^^${encodeIRI(type)}`;
    }
    Quad.encodeLiteral = encodeLiteral;
    function isQuad(quad) {
        return quad != null &&
            typeof quad === 'object' &&
            typeof quad['subject'] === 'string' &&
            typeof quad['predicate'] === 'string' &&
            typeof quad['object'] === 'string';
    }
    Quad.isQuad = isQuad;
    function compare(a, b) {
        const compareSubjects = a.subject.localeCompare(b.subject);
        const comparePredicates = a.predicate.localeCompare(b.predicate);
        const compareObjects = a.object.localeCompare(b.object);
        const compareLabels = a.label.localeCompare(b.label);
        return (compareSubjects !== 0 ? compareSubjects :
            comparePredicates !== 0 ? comparePredicates :
                compareObjects !== 0 ? compareObjects :
                    compareLabels !== 0 ? compareLabels :
                        0);
    }
    Quad.compare = compare;
    function fromNQuads(nquads) {
        const parser = n3.Parser();
        const quads = parser.parse(nquads, null).map(({ subject, predicate, object, graph }) => {
            return Object.assign({ subject,
                predicate,
                object }, (graph != null && graph != "" ? { label: graph } : {}));
        });
        return quads;
    }
    Quad.fromNQuads = fromNQuads;
    function toNQuads(quads) {
        return quads.map(quad => {
            const { subject, predicate, object, label } = quad;
            return `<${subject}> <${predicate}> ${encodeRDF(object)} ${label ? `<${label}>` : ''} .\n`;
        }).join('');
    }
    Quad.toNQuads = toNQuads;
    ;
})(Quad = exports.Quad || (exports.Quad = {}));
exports.default = Quad;
