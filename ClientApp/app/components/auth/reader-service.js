"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var reader_1 = require("../api/reader");
var aurelia_framework_1 = require("aurelia-framework");
var interval = require('interval-promise');
var ReaderService = /** @class */ (function () {
    function ReaderService() {
        this.canConnect = false;
        this.connect();
    }
    ReaderService_1 = ReaderService;
    ReaderService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, ReaderService_1.isConnected()];
                    case 1:
                        _a.canConnect = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReaderService.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader_1.Reader_CanConnect()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Ensures only one reader operation is being carried out
    ReaderService.startPollingReader = function (item, speed) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ReaderService_1.readerIsOn) return [3 /*break*/, 2];
                        console.log("Waiting to start reader..");
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        speed ? this.pollReader(item, speed) : this.pollReader(item);
                        return [2 /*return*/];
                }
            });
        });
    };
    ReaderService.stopPollingReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stop = true;
                        _a.label = 1;
                    case 1:
                        if (!ReaderService_1.readerIsOn) return [3 /*break*/, 3];
                        console.log("Waiting to stop reader..");
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReaderService.pollReader = function (item, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var delay;
            return __generator(this, function (_a) {
                this.stop = false;
                ReaderService_1.readerIsOn = true;
                console.log("Reader started");
                delay = speed ? speed : Infinity;
                interval(function (iteration, stop) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.stop) return [3 /*break*/, 2];
                                console.log("Reader stopped");
                                ReaderService_1.readerIsOn = false;
                                stop();
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [4 /*yield*/, item().catch(function (error) {
                                    console.log("error while polling reader: " + error);
                                    _this.stop = true;
                                })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 0, { iterations: delay, stopOnError: true });
                return [2 /*return*/];
            });
        });
    };
    ReaderService.readerOn = function () {
        return ReaderService_1.readerIsOn;
    };
    ReaderService.readerIsOn = false;
    ReaderService.stop = false;
    ReaderService = ReaderService_1 = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [])
    ], ReaderService);
    return ReaderService;
    var ReaderService_1;
}());
exports.ReaderService = ReaderService;
//# sourceMappingURL=reader-service.js.map