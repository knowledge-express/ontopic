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
const Bus = require("./bus");
exports.Bus = Bus;
const Store = require("./store");
exports.Store = Store;
const EphemeralBus = require("./bus/ephemeral");
const ephemeral_1 = require("./store/ephemeral");
const observable_1 = require("./bus/observable");
function ontopic(config = config_1.default.Default) {
    return ontopic.fromConfig(config);
}
exports.ontopic = ontopic;
;
(function (ontopic) {
    function fromConfig(config) {
        return create(config.encoder);
    }
    ontopic.fromConfig = fromConfig;
    ;
    function create(encoder) {
        const store = ephemeral_1.default.create();
        const bus = EphemeralBus.create();
        const encoded = Store.encode(store, encoder);
        return connect(encoded, bus);
    }
    ontopic.create = create;
    ;
    function connect(store, bus) {
        const storeUpdates = observable_1.Subject.create();
        function add(data) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield store.add(data);
                storeUpdates.onNext({ action: 'add', data: result });
                return result;
            });
        }
        function remove(data) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield store.remove(data);
                storeUpdates.onNext({ action: 'remove', data: result });
                return result;
            });
        }
        const newStore = Object.assign({}, Store.readOnly(store), { add,
            remove });
        const busUpdates = observable_1.Subject.create();
        const newBus = EphemeralBus.create((subject) => {
            storeUpdates.subscribe(subject);
            busUpdates.subscribe(subject);
            bus.subject.subscribe(subject);
        });
        observable_1.Observable.map(newBus.subject, (mutation) => __awaiter(this, void 0, void 0, function* () {
            const { action, data } = mutation;
            const result = yield store[action](data);
            return { action, data: result };
        })).subscribe(busUpdates);
        return {
            bus: newBus,
            store: newStore
        };
    }
    ontopic.connect = connect;
    ;
})(ontopic = exports.ontopic || (exports.ontopic = {}));
exports.default = ontopic;
__export(require("./config"));
__export(require("./ontology"));
__export(require("./data"));
if (require.main === module) {
    console.log('Starting as script...');
}
