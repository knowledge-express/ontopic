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
var Mutation;
(function (Mutation) {
    function isMutation(obj) {
        return typeof obj === 'object' &&
            'action' in obj &&
            (obj['action'] === 'add' || obj['action'] === 'remove') &&
            'data' in obj;
    }
    Mutation.isMutation = isMutation;
    ;
    function add(data) {
        return { action: 'add', data };
    }
    Mutation.add = add;
    ;
    function remove(data) {
        return { action: 'remove', data };
    }
    Mutation.remove = remove;
    ;
    function apply(mutation, store) {
        return __awaiter(this, void 0, void 0, function* () {
            const { action, data } = mutation;
            const result = yield store[action](data);
            return { action, data: result };
        });
    }
    Mutation.apply = apply;
    function map(mutation, mapFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoded = yield mapFn(mutation.data);
            return Object.assign({}, mutation, { data: encoded });
        });
    }
    Mutation.map = map;
})(Mutation = exports.Mutation || (exports.Mutation = {}));
;
exports.default = Mutation;
