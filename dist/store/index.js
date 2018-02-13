"use strict";
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
            query: store.query,
            filter: store.filter,
            getValues: store.getValues,
        };
    }
    Store.readOnly = readOnly;
    ;
})(Store = exports.Store || (exports.Store = {}));
;
exports.default = Store;
