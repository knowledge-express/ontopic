"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
function ontopic(config = config_1.default.Default) {
    return ontopic.create(config);
}
exports.ontopic = ontopic;
(function (ontopic) {
    function create(config) {
        return null;
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
