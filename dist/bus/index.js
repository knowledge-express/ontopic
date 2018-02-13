"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bus;
(function (Bus) {
    function isBus(obj) {
        return isReadableBus(obj) || isMutableBus(obj);
    }
    Bus.isBus = isBus;
    ;
    function isReadableBus(obj) {
        return typeof obj === 'object' && 'observable' in obj;
    }
    Bus.isReadableBus = isReadableBus;
    ;
    function isMutableBus(obj) {
        return isReadableBus(obj) && 'observable' in obj;
    }
    Bus.isMutableBus = isMutableBus;
    ;
    function readOnly(bus) {
        return {
            observable: bus.observable
        };
    }
    Bus.readOnly = readOnly;
    ;
    function query(bus, query) {
        return;
    }
    Bus.query = query;
})(Bus = exports.Bus || (exports.Bus = {}));
;
exports.default = Bus;
