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
const observable_1 = require("./observable");
const data_1 = require("../data");
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
