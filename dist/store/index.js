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
const rdf = require('rdf');
function isStore(obj) {
    return isReadableStore(obj) || isMutableStore(obj);
}
exports.isStore = isStore;
;
function isReadableStore(store) {
    return typeof store === 'object' && 'query' in store;
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
        query: store.query,
        filter: store.filter,
        getValues: store.getValues,
    };
}
exports.readOnly = readOnly;
;
function encode(store, encoder) {
    function query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield store.query(query);
            const encoded = encoder.encode(result);
            return encoded;
        });
    }
    function filter() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    function getValues() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    if (!isMutableStore(store))
        return { query, filter, getValues };
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
    return {
        query,
        filter,
        getValues,
        add,
        remove,
    };
}
exports.encode = encode;
;
