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
    function toQuads(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const nquads = yield jsonld_1.promises.toRDF(doc, { format: 'application/nquads' });
            const quads = _1.Quad.fromNQuads(nquads);
            return quads;
        });
    }
    JSONLD.toQuads = toQuads;
    ;
    function fromQuads(quads) {
        return __awaiter(this, void 0, void 0, function* () {
            const nquads = _1.Quad.toNQuads(quads);
            const doc = yield jsonld_1.promises.fromRDF(nquads);
            return doc;
        });
    }
    JSONLD.fromQuads = fromQuads;
})(JSONLD = exports.JSONLD || (exports.JSONLD = {}));
;
exports.default = JSONLD;
