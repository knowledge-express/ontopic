"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
var Config;
(function (Config) {
    Config.Default = {
        encoder: data_1.Encoder.Identity(),
        busses: [],
        stores: [],
    };
    function ontology(config, ontology) {
        return config;
    }
    Config.ontology = ontology;
    ;
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
