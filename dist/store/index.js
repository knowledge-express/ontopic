"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const rdf = require('rdf');
__export(require("./composite"));
function isStore(obj) {
    return isReadableStore(obj) || isMutableStore(obj);
}
exports.isStore = isStore;
;
function isReadableStore(store) {
    return typeof store === 'object' && 'getPropertyValue' in store && 'findBy' in store;
}
exports.isReadableStore = isReadableStore;
;
function isMutableStore(store) {
    return isReadableStore(store) && 'add' in store && 'remove' in store;
}
exports.isMutableStore = isMutableStore;
;
function readOnly(store) {
    return {
        getPropertyValue: store.getPropertyValue,
        findBy: store.findBy,
    };
}
exports.readOnly = readOnly;
;
function encode(store, encoder) {
    if (!isMutableStore(store))
        return readOnly(store);
    const add = (data) => __awaiter(this, void 0, void 0, function* () {
        const decoded = yield encoder.decode(data);
        const encoded = yield encoder.encode(yield store.add(decoded));
        return encoded;
    });
    const remove = (data) => __awaiter(this, void 0, void 0, function* () {
        const decoded = yield encoder.decode(data);
        const encoded = yield encoder.encode(yield store.remove(decoded));
        return encoded;
    });
    return Object.assign({}, readOnly(store), { add,
        remove });
}
exports.encode = encode;
;
