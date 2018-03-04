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
const jsonld_1 = require("jsonld");
const observable_1 = require("./observable");
const data_1 = require("../data");
const JSONLDStore = require("../store/jsonld");
const EphemeralBus = require("./ephemeral");
exports.EphemeralBus = EphemeralBus;
__export(require("./observable"));
function isBus(obj) {
    return isReadableBus(obj) || isMutableBus(obj);
}
exports.isBus = isBus;
;
function isReadableBus(obj) {
    return typeof obj === 'object' && 'observable' in obj;
}
exports.isReadableBus = isReadableBus;
;
function isMutableBus(obj) {
    return isReadableBus(obj) && 'subject' in obj;
}
exports.isMutableBus = isMutableBus;
;
function readOnly(bus) {
    return {
        observable: bus.observable
    };
}
exports.readOnly = readOnly;
;
function map(bus, mapFn) {
    const mappedUpdates = observable_1.Observable.map(bus.observable, mapFn);
    if (!isMutableBus(bus))
        return { observable: mappedUpdates };
    const mapedUpdateRequests = observable_1.Subject.create();
    observable_1.Observable.map(bus.subject, mapFn).subscribe(mapedUpdateRequests);
    return {
        observable: mappedUpdates,
        subject: mapedUpdateRequests
    };
}
exports.map = map;
;
function filter(bus, filterFn) {
    const filteredUpdates = observable_1.Observable.filter(bus.observable, filterFn);
    if (!isMutableBus(bus))
        return { observable: filteredUpdates };
    const filteredUpdateRequests = observable_1.Subject.create();
    observable_1.Observable.filter(bus.subject, filterFn).subscribe(filteredUpdateRequests);
    return {
        observable: filteredUpdates,
        subject: filteredUpdateRequests
    };
}
exports.filter = filter;
;
function flatten(bus) {
    const flattenedUpdates = observable_1.Observable.flatten(bus.observable);
    if (!isMutableBus(bus))
        return { observable: flattenedUpdates };
    const flattenedUpdateRequests = observable_1.Subject.create();
    observable_1.Observable.flatten(bus.subject).subscribe(flattenedUpdateRequests);
    return {
        observable: flattenedUpdates,
        subject: flattenedUpdateRequests
    };
}
exports.flatten = flatten;
;
function zip(bus, other) {
    const zippedUpdates = observable_1.Observable.zip(bus.observable, other.observable);
    if (!(isMutableBus(bus) && isMutableBus(other)))
        return { observable: zippedUpdates };
    const zippedUpdateRequests = observable_1.Subject.create();
    observable_1.Observable.zip(bus.subject, other.subject).subscribe(zippedUpdateRequests);
    return {
        observable: zippedUpdates,
        subject: zippedUpdateRequests
    };
}
exports.zip = zip;
function encode(bus, encoder) {
    return map(bus, (mutation) => __awaiter(this, void 0, void 0, function* () { return data_1.Mutation.map(mutation, encoder.encode); }));
}
exports.encode = encode;
;
function frame(bus, frame, validator = data_1.JSONLD.hasDefinedValues) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Expanding frame');
        const expanded = yield jsonld_1.promises.expand(frame);
        console.log('Flattening frame');
        const flattened = yield jsonld_1.promises.flatten(expanded);
        console.log('Building type index');
        const typeIndex = flattened.reduce((memo, frame) => {
            const types = [].concat(frame["@type"] || []);
            return types.reduce((memo, type) => (Object.assign({}, memo, { [type]: frame })), memo);
        }, {});
        const framedUpdates = observable_1.Subject.create();
        console.log('Filtering by types:', Object.keys(typeIndex));
        const filtered = observable_1.Observable.filter(bus.observable, mutation => {
            console.log('Filtering mutation based on types.');
            const { data } = mutation;
            const types = [].concat(data["@type"] || []);
            const hasType = types.reduce((memo, type) => memo || type in typeIndex, false);
            console.log('Has type?', hasType);
            return hasType;
        });
        console.log('Creating cache');
        const cache = JSONLDStore.create();
        const framed = observable_1.Observable.map(filtered, (mutation) => __awaiter(this, void 0, void 0, function* () {
            const { action, data } = mutation;
            console.log('Applying mutation to cache:', action, data);
            const result = yield cache[action](data);
            const framed = yield cache.query(frame);
            return [framed, mutation];
        }));
        const validated = observable_1.Observable.filter(framed, ([framed, mutation]) => __awaiter(this, void 0, void 0, function* () {
            const result = yield validator(framed, mutation);
            console.log('Filtering on validation:', result, mutation);
            return result;
        }));
        const removedFromCache = observable_1.Observable.map(validated, ([framed, mutation]) => __awaiter(this, void 0, void 0, function* () {
            yield cache.remove(framed);
            return Object.assign({}, mutation, { data: framed });
        }));
        removedFromCache.subscribe(framedUpdates);
        return { observable: framedUpdates };
    });
}
exports.frame = frame;
;
