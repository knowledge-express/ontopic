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
const config_1 = require("./config");
const EphemeralBus = require("./bus/ephemeral");
const EphemeralStore = require("./store/ephemeral");
const observable_1 = require("./bus/observable");
function ontopic(config = config_1.default.Default) {
    return ontopic.create(config);
}
exports.ontopic = ontopic;
(function (ontopic) {
    function create(config) {
        const store = EphemeralStore.create();
        const storeUpdates = observable_1.Subject.create();
        const newStore = Object.assign({}, store, { add: (data) => __awaiter(this, void 0, void 0, function* () {
                const result = yield store.add(data);
                storeUpdates.onNext({ action: 'add', data: result });
                return result;
            }), remove: (data) => __awaiter(this, void 0, void 0, function* () {
                const result = yield store.remove(data);
                storeUpdates.onNext({ action: 'remove', data: result });
                return result;
            }) });
        const busUpdates = observable_1.Subject.create();
        const bus = EphemeralBus.create((subject) => {
            storeUpdates.subscribe(subject);
            busUpdates.subscribe(subject);
        });
        observable_1.Observable.map(bus.subject, (mutation) => __awaiter(this, void 0, void 0, function* () {
            const { action, data } = mutation;
            return { action, data: yield store[action](data) };
        })).subscribe(busUpdates);
        return {
            bus,
            store: newStore
        };
    }
    ontopic.create = create;
    ;
})(ontopic = exports.ontopic || (exports.ontopic = {}));
exports.default = ontopic;
__export(require("./config"));
__export(require("./ontology"));
__export(require("./bus"));
__export(require("./store"));
if (require.main === module) {
    console.log('Starting as script...');
}
