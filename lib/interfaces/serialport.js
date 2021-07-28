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
// @ts-ignore
var parser_inter_byte_timeout_1 = __importDefault(require("@serialport/parser-inter-byte-timeout"));
var serialport_1 = __importDefault(require("serialport"));
var helper_1 = __importDefault(require("./helper"));
var interface_1 = __importDefault(require("./interface"));
var SerialInterface = /** @class */ (function (_super) {
    __extends(SerialInterface, _super);
    function SerialInterface(port, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.promiseQueue = new helper_1.default();
        _this.connected = new Promise(function (resolve) {
            _this.port = new serialport_1.default(port, __assign({ baudRate: 115200, dataBits: 8, stopBits: 1, parity: "none", rtscts: false, xany: false, xon: false, xoff: false }, options), function (err) {
                if (err) {
                    console.warn(err);
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
            _this.stream = _this.port.pipe(new parser_inter_byte_timeout_1.default({ interval: 30 }));
            _this.stream.on("data", function (data) {
                _this.promiseQueue.push(data);
            });
        });
        return _this;
    }
    SerialInterface.prototype.isPrinterConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.connected];
            });
        });
    };
    SerialInterface.prototype.execute = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.port.isOpen) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return _this.port.open(function (err) { return err ? reject(err) : resolve(); }); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.port.write(cmd);
                        if (!this.options.drain) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return _this.port.drain(function (err) { return err ? reject(err) : resolve(); }); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SerialInterface.prototype.executeCommand = function (cmd, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.promiseQueue.flush();
                        return [4 /*yield*/, this.execute(cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.promiseQueue.readBlocking(timeout)];
                }
            });
        });
    };
    return SerialInterface;
}(interface_1.default));
exports.default = SerialInterface;
