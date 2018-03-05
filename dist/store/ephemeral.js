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
const rdf = require("rdf");
var EphemeralStore;
(function (EphemeralStore) {
    function create() {
        const graph = new rdf.Graph;
        const store = {
            graph,
            getPropertyValue: (id, property) => __awaiter(this, void 0, void 0, function* () { return getPropertyValue(store, id, property); }),
            findBy: () => __awaiter(this, void 0, void 0, function* () { return findBy(store); }),
            add: (data) => add(store, data),
            remove: (data) => remove(store, data),
        };
        return store;
    }
    EphemeralStore.create = create;
    ;
    function getPropertyValue(store, id, property) {
        return __awaiter(this, void 0, void 0, function* () {
            const objects = store.graph.match(id, property, null).map(t => t.object);
            return objects.length === 1 ? objects[0] : objects.length ? objects : null;
        });
    }
    EphemeralStore.getPropertyValue = getPropertyValue;
    function findBy(store) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    EphemeralStore.findBy = findBy;
    function add(store, data) {
        return data.map(quad => {
            const { subject, predicate, object } = quad;
            store.graph.add(rdf.environment.createTriple(subject, predicate, object));
            return quad;
        });
    }
    EphemeralStore.add = add;
    ;
    function remove(store, data) {
        return data.map(quad => {
            const { subject, predicate, object } = quad;
            store.graph.remove(rdf.environment.createTriple(subject, predicate, object));
            return quad;
        });
    }
    EphemeralStore.remove = remove;
    ;
})(EphemeralStore = exports.EphemeralStore || (exports.EphemeralStore = {}));
;
exports.default = EphemeralStore;
