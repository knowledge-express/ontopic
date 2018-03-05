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
var CompositeStore;
(function (CompositeStore) {
    function create(stores) {
        return {
            getPropertyValue: (id, property) => getPropertyValue(stores, id, property),
            findBy: (types, predicate, value) => findBy(stores, types, predicate, value),
        };
    }
    CompositeStore.create = create;
    function getPropertyValue(stores, id, property) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getPropertyValue:', id, property);
            const res = (yield Promise.all(stores.map(store => store.getPropertyValue(id, property)))).reduce((memo, result) => {
                if (memo == null && result == null)
                    return null;
                if (memo == null && result != null)
                    return result;
                if (memo != null && result == null)
                    return memo;
                if (memo != null && result != null)
                    return [].concat(memo, result);
            }, undefined);
            console.log('getPropertyValue result:', res);
            return res;
        });
    }
    CompositeStore.getPropertyValue = getPropertyValue;
    function findBy(stores, types, predicate, value) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('findBy:', types, predicate, value);
            const res = (yield Promise.all(stores.map(store => store.findBy(types, predicate, value)))).reduce((memo, result) => {
                if (memo == null && result == null)
                    return null;
                if (memo == null && !(result == null))
                    return result;
                if (memo != null && result == null)
                    return memo;
                if (memo != null && result != null)
                    return [].concat(memo, result);
            }, undefined);
            console.log('findBy result:', res);
            return res;
        });
    }
    CompositeStore.findBy = findBy;
})(CompositeStore = exports.CompositeStore || (exports.CompositeStore = {}));
exports.default = CompositeStore;
