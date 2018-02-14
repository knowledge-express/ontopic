"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return isReadableBus(obj) && 'observable' in obj;
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
function query(bus, query) {
    return;
}
exports.query = query;
