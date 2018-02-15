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
const _1 = require(".");
var Encoder;
(function (Encoder) {
    function Identity() {
        return {
            encode: (data) => data,
            decode: (encoded) => encoded,
        };
    }
    Encoder.Identity = Identity;
    ;
    function JSONLDToQuads() {
        return {
            encode: (data) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.toQuads(data);
            }),
            decode: (encoded) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.fromQuads(encoded);
            })
        };
    }
    Encoder.JSONLDToQuads = JSONLDToQuads;
    ;
    Encoder.quadsToJSONLD = () => invert(JSONLDToQuads());
    function compactJSONLD(context) {
        return {
            encode: (data) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.compact(data, context);
            }),
            decode: (encoded) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.expand(encoded, context);
            })
        };
    }
    Encoder.compactJSONLD = compactJSONLD;
    ;
    function expandJSONLD(context) {
        return {
            encode: (data) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.expand(data, context);
            }),
            decode: (encoded) => __awaiter(this, void 0, void 0, function* () {
                return yield _1.JSONLD.compact(encoded, context);
            })
        };
    }
    Encoder.expandJSONLD = expandJSONLD;
    ;
    function invert(encoder) {
        function encode(data) {
            return __awaiter(this, void 0, void 0, function* () {
                return encoder.decode(data);
            });
        }
        function decode(encoded) {
            return __awaiter(this, void 0, void 0, function* () {
                return encoder.encode(encoded);
            });
        }
        return {
            encode,
            decode
        };
    }
    Encoder.invert = invert;
    ;
    function compose(a, b) {
        function encode(x) {
            return __awaiter(this, void 0, void 0, function* () {
                const y = yield a.encode(x);
                const z = yield b.encode(y);
                return z;
            });
        }
        function decode(z) {
            return __awaiter(this, void 0, void 0, function* () {
                const y = yield b.decode(z);
                const x = yield a.decode(y);
                return x;
            });
        }
        return {
            encode,
            decode
        };
    }
    Encoder.compose = compose;
    ;
})(Encoder = exports.Encoder || (exports.Encoder = {}));
;
exports.default = Encoder;
