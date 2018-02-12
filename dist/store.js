"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rdf = require('rdf');
var ReadableStore;
(function (ReadableStore) {
    function isReadableStore(store) {
        return false;
    }
    ReadableStore.isReadableStore = isReadableStore;
    ;
    function query(store, query) {
        return null;
    }
    ReadableStore.query = query;
    ;
})(ReadableStore = exports.ReadableStore || (exports.ReadableStore = {}));
;
var MutableStore;
(function (MutableStore) {
    function isMutableStore(store) {
        return false;
    }
    MutableStore.isMutableStore = isMutableStore;
    ;
    function add(store, data) {
        return null;
    }
    MutableStore.add = add;
    ;
    function remove(store, data) {
        return null;
    }
    MutableStore.remove = remove;
    ;
})(MutableStore = exports.MutableStore || (exports.MutableStore = {}));
var Store;
(function (Store) {
    function _fromConfig(config) {
        return {};
    }
    ;
    function create(config) {
        let store = _fromConfig(config);
        const storeFns = Object.keys(Store).reduce((memo, key) => {
            const fn = Store[key];
            return Object.assign({}, memo, { [key]: (...args) => fn(store, ...args) });
        }, {});
        store = Object.assign({}, store, storeFns);
        const readableStoreFns = Object.keys(ReadableStore).reduce((memo, key) => {
            const fn = Store[key];
            return Object.assign({}, memo, { [key]: (...args) => fn(store, ...args) });
        }, {});
        store = Object.assign({}, store, readableStoreFns);
        if ('mutable' in config && config.mutable) {
            const mutableStoreFns = Object.keys(MutableStore).reduce((memo, key) => {
                const fn = Store[key];
                return Object.assign({}, memo, { [key]: (...args) => fn(store, ...args) });
            }, {});
            store = Object.assign({}, store, mutableStoreFns);
            return store;
        }
        return store;
    }
    Store.create = create;
    ;
    function isStore(obj) {
        return ReadableStore.isReadableStore(obj) || MutableStore.isMutableStore(obj);
    }
    Store.isStore = isStore;
    ;
})(Store = exports.Store || (exports.Store = {}));
;
exports.default = Store;
