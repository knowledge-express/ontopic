"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n3 = require("n3");
const Helpers = require(".");
var Quad;
(function (Quad) {
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
            return {
                subject,
                predicate,
                object,
                label: graph
            };
        });
        return quads;
    }
    Quad.fromNQuads = fromNQuads;
    Quad.toNQuads = (quads) => {
        return quads.map(quad => {
            const { subject, predicate, object, label } = quad;
            return `<${subject}> <${predicate}> ${Helpers.encodeRDF(object)} ${label ? `<${label}>` : ''} .\n`;
        }).join('');
    };
})(Quad = exports.Quad || (exports.Quad = {}));
