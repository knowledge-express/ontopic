"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config;
(function (Config) {
    Config.Default = {
        busses: [],
        stores: [],
    };
    function bus(config, bus) {
        return config;
    }
    Config.bus = bus;
    ;
    function store(config, store) {
        return config;
    }
    Config.store = store;
    ;
})(Config = exports.Config || (exports.Config = {}));
;
exports.default = Config;
