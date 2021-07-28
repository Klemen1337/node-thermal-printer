"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryOptions = exports.PromiseResolver = void 0;
var url_1 = require("url");
var PromiseResolver = /** @class */ (function () {
    function PromiseResolver(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }
    return PromiseResolver;
}());
exports.PromiseResolver = PromiseResolver;
function parseQueryOptions(optionsString) {
    var options = new url_1.URLSearchParams(optionsString);
    return Array.from(options.entries()).reduce(function (o, _a) {
        var k = _a[0], v = _a[1];
        var nv = Number(v);
        o[k] = nv.toString() === v ? nv : v;
        return o;
    }, {});
}
exports.parseQueryOptions = parseQueryOptions;
var PromiseQueue = /** @class */ (function () {
    function PromiseQueue() {
        this.promiseQueue = [];
        this.entryQueue = [];
    }
    Object.defineProperty(PromiseQueue.prototype, "length", {
        get: function () {
            if (this.entryQueue.length === 0) {
                return this.promiseQueue.length * -1;
            }
            else {
                return this.entryQueue.length;
            }
        },
        enumerable: false,
        configurable: true
    });
    PromiseQueue.prototype.isEmpty = function () {
        return this.promiseQueue.length === 0 && this.entryQueue.length === 0;
    };
    PromiseQueue.prototype.isBufferEmpty = function () {
        return this.entryQueue.length === 0;
    };
    PromiseQueue.prototype.flush = function () {
        this.entryQueue.splice(0, this.entryQueue.length);
    };
    PromiseQueue.prototype.push = function () {
        var entries = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entries[_i] = arguments[_i];
        }
        for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
            var e = entries_1[_a];
            var p = this.promiseQueue.shift();
            if (p) {
                p.resolve(e);
            }
            else {
                this.entryQueue.push(e);
            }
        }
    };
    PromiseQueue.prototype.pushError = function (e) {
        var p = this.promiseQueue.shift();
        if (p) {
            p.reject(e);
        }
    };
    PromiseQueue.prototype.read = function (block, timeout) {
        if (block === void 0) { block = true; }
        return block ? this.readBlocking(timeout) : Promise.resolve(this.readSync());
    };
    PromiseQueue.prototype.readSync = function () {
        return this.entryQueue.shift();
    };
    PromiseQueue.prototype.readBlocking = function (timeout) {
        var e = this.readSync();
        return e ? Promise.resolve(e) : this.queuedEntry(timeout);
    };
    PromiseQueue.prototype.abort = function (error) {
        for (var _i = 0, _a = this.promiseQueue; _i < _a.length; _i++) {
            var p = _a[_i];
            p.reject(error);
        }
    };
    PromiseQueue.prototype.queuedEntry = function (timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var timer;
            var promiseResolver = new PromiseResolver(function (result) {
                timer && clearTimeout(timer);
                resolve(result);
            }, function (err) {
                timer && clearTimeout(timer);
                reject(err);
            });
            _this.promiseQueue.push(promiseResolver);
            if (timeout) {
                timer = setTimeout(function () {
                    var idx = _this.promiseQueue.indexOf(promiseResolver);
                    if (idx > -1) {
                        _this.promiseQueue.splice(idx, 1);
                    }
                    promiseResolver.reject(new Error("Wait-Timeout"));
                }, timeout);
            }
        });
    };
    return PromiseQueue;
}());
exports.default = PromiseQueue;
