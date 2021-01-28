"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
function getInterface(uri, options, driver) {
    if (options === void 0) { options = {}; }
    var networkRegex = /^tcp:\/\/([^\/:]+)(?::(\d+))?\/?$/i;
    var printerRegex = /^printer:([^\/]+)(?:\/([\w-]*))?$/i;
    var serialRegex = /^serial:([^?]+)(?:\?(.*))?$/i;
    var net = networkRegex.exec(uri);
    var printer = printerRegex.exec(uri);
    var serial = serialRegex.exec(uri);
    if (typeof uri === "object") {
        return uri;
    }
    else if (net) {
        var Network = require('./network');
        return new Network(net[1], net[2], options);
    }
    else if (printer) {
        var Printer = require('./printer');
        return new Printer(printer[1], driver);
    }
    else if (serial) {
        var Serial = require('./serialport').default;
        return new Serial(serial[1], __assign(__assign({}, (options || {})), (serial[2] && helper_1.parseQueryOptions(serial[2]) || {})));
    }
    else {
        var File_1 = require('./file');
        return new File_1(uri);
    }
}
exports.default = getInterface;
