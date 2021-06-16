"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var interface_1 = __importDefault(require("./interface"));
var helper_1 = __importDefault(require("./helper"));
var i = 0;
var Network = /** @class */ (function (_super) {
    __extends(Network, _super);
    function Network(host, port, options) {
        var _this = _super.call(this) || this;
        options = options || {};
        _this.timeout = options.timeout || 8000;
        _this.host = host;
        _this.port = port || 9100;
        _this.promiseQueue = new helper_1.default();
        return _this;
    }
    Network.prototype.isPrinterConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = Boolean;
                        return [4 /*yield*/, this.connect()];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    Network.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conId;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.connectPromise) {
                    return [2 /*return*/, this.connectPromise];
                }
                conId = ++i;
                if (!this.connection) {
                    this.connectPromise = new Promise(function (resolve, reject) {
                        var connection = net_1.default.connect({
                            host: _this.host,
                            port: _this.port,
                            timeout: _this.timeout
                        }, function () {
                            _this.connectPromise = undefined;
                            resolve(connection);
                        });
                        _this.connection = connection;
                        connection.on("data", function (data) {
                            _this.promiseQueue.push(data);
                        });
                        connection.on('error', function (error) {
                            console.error("Printer network connection error:", error);
                            _this.connectPromise && resolve(undefined);
                            connection.destroy();
                            _this.connection = undefined;
                            _this.connectPromise = undefined;
                        });
                        connection.on('timeout', function () {
                            if (_this.connectPromise) {
                                console.error("Printer network connection timeout.", conId);
                                _this.connectPromise && resolve(undefined);
                            }
                            else {
                                console.log("Printer network connection timeout: closing unused connection", conId);
                            }
                            connection.destroy();
                            _this.connection = undefined;
                            _this.connectPromise = undefined;
                        });
                        connection.on('close', function () {
                            console.warn("Printer network connection closed.");
                            _this.connectPromise && resolve(undefined);
                            connection.destroy();
                            _this.connection = undefined;
                            _this.connectPromise = undefined;
                        });
                    });
                    return [2 /*return*/, this.connectPromise];
                }
                return [2 /*return*/, this.connection];
            });
        });
    };
    Network.prototype.execute = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var connection;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.connect()];
                                case 1:
                                    connection = _a.sent();
                                    if (connection) {
                                        connection.write(buffer, 'utf8', function (err) { return err ? reject(err) : resolve(); });
                                    }
                                    else {
                                        reject('connection failed');
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Network.prototype.executeCommand = function (cmd, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.execute(cmd);
                return [2 /*return*/, this.promiseQueue.readBlocking(timeout)];
            });
        });
    };
    return Network;
}(interface_1.default));
exports.default = Network;
