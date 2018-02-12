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
var Store;
(function (Store) {
    function isStore(obj) {
        return isReadableStore(obj) || isMutableStore(obj);
    }
    Store.isStore = isStore;
    ;
    function isReadableStore(store) {
        return typeof store === 'object' && 'query' in store;
    }
    Store.isReadableStore = isReadableStore;
    ;
    function isMutableStore(store) {
        return isReadableStore(store) && 'add' in store && 'remove' in store;
    }
    Store.isMutableStore = isMutableStore;
    ;
    function readOnly(store) {
        return {
            query: store.query
        };
    }
    Store.readOnly = readOnly;
    ;
    function map(store, mapFn) {
        let res = {
            query: (q) => __awaiter(this, void 0, void 0, function* () { return mapFn(yield store.query(q)); })
        };
        if (isMutableStore(store)) {
            throw new Error('Not implemented.');
        }
        return res;
    }
    Store.map = map;
    ;
})(Store = exports.Store || (exports.Store = {}));
;
exports.default = Store;
