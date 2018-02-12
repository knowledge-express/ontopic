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
        let ontop = {
            config
        };
        const functions = Object.keys(ontopic).reduce((memo, key) => {
            const fn = ontopic[key];
            return Object.assign({}, memo, { [key]: (...args) => fn(ontop, ...args) });
        }, {});
        ontop = Object.assign({}, ontop, functions);
        return ontop;
    }
    ontopic.create = create;
    ;
    function bus(ontop, bus) {
        return ontop;
    }
    ontopic.bus = bus;
    ;
    function store(ontop, store) {
        return ontop;
    }
    ontopic.store = store;
    ;
    function graphql(ontop) {
        return ontop;
    }
    ontopic.graphql = graphql;
    ;
    function start(ontop) {
        console.log('Staring ontopic with config:', ontop.config);
        return;
    }
    ontopic.start = start;
    ;
})(ontopic = exports.ontopic || (exports.ontopic = {}));
exports.default = ontopic;
__export(require("./config"));
if (require.main === module) {
    console.log('Starting as script...');
    const db = ontopic();
    db.start();
}
