"use strict";
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
var Genericreader = require("../generic-reader");
var GenericReader = Genericreader.GenericReader;
var inventory_1 = require("../data-structures/inventory");
var PositionalScanner = /** @class */ (function () {
    function PositionalScanner(readerId) {
        this.lock = false;
        this.changedSlots = [];
        this.previousScan = [];
        this.change = false;
        // Used to optimse sort/database calls by keeping a copy of the previous scan and only providing the new entries
        this.keepPreviousScan = false;
        this.reader = new GenericReader(readerId);
    }
    // Initialise the readerconvertFrom
    PositionalScanner.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reader.init()];
                    case 1:
                        _a.sent();
                        this.previousScan = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    // Responsible for gathering tags from service (reader) and manages the detection of new tags
    PositionalScanner.prototype.scan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var newChange, readerResponse_1, ResultArrayObjOne, ResultArrayObjTwo, _loop_1, this_1, containsTag, antennaNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.lock) return [3 /*break*/, 2];
                        this.lock = true;
                        newChange = false;
                        return [4 /*yield*/, this.reader.getInventory().catch(function (error) {
                                throw error;
                            })];
                    case 1:
                        readerResponse_1 = _a.sent();
                        ResultArrayObjOne = readerResponse_1.filter(function (_a) {
                            var newreading = _a.antenna;
                            return !_this.previousScan.some(function (_a) {
                                var previousreading = _a.antenna;
                                return previousreading === newreading;
                            });
                        });
                        ResultArrayObjTwo = this.previousScan.filter(function (_a) {
                            var previousreading = _a.antenna;
                            return !readerResponse_1.some(function (_a) {
                                var newreading = _a.antenna;
                                return previousreading === newreading;
                            });
                        });
                        if (ResultArrayObjOne.length > 0 || ResultArrayObjTwo.length > 0) {
                            this.changedSlots = [];
                            // First read?
                            if (this.previousScan.length !== 0 && this.keepPreviousScan) {
                                _loop_1 = function (antennaNo) {
                                    var thisRead = readerResponse_1.find(function (inv) { return inv.antenna === (antennaNo + 1); });
                                    var lastRead = this_1.previousScan.find(function (inv) { return inv.antenna === (antennaNo + 1); });
                                    containsTag = false;
                                    // Is there a tag at this antenna?
                                    if (thisRead && thisRead.hasOwnProperty("UID")) {
                                        if (readerResponse_1.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.length !== 0) {
                                            containsTag = true;
                                        }
                                    }
                                    // Was there a tag at this antenna on the last read?
                                    if (lastRead && lastRead.hasOwnProperty("UID") && lastRead.UID.length !== 0) {
                                        // Is there a tag now?
                                        if (containsTag) {
                                            // Is it not the same tag?
                                            if (!readerResponse_1.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.find(function (newTag) { return newTag === (_this.previousScan.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.find(function (lastTag) { return lastTag === newTag; })); })) {
                                                newChange = true;
                                                this_1.changedSlots.push(readerResponse_1.find(function (inv) { return inv.antenna === (antennaNo + 1); }));
                                            }
                                        } // There is no tag on that antenna now
                                        else {
                                            newChange = true;
                                            // Enter missing tag
                                            var inv = new inventory_1.Inventory();
                                            inv.antenna = antennaNo + 1;
                                            this_1.changedSlots.push((inv));
                                        }
                                    } // There was no tag on that antenna before
                                    else {
                                        // Change has occurred if new tag has appeared
                                        if (containsTag) {
                                            newChange = true;
                                            this_1.changedSlots.push(readerResponse_1.find(function (inv) { return inv.antenna === (antennaNo + 1); }));
                                        }
                                    }
                                };
                                this_1 = this;
                                // Reset new found tags list
                                for (antennaNo = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {
                                    _loop_1(antennaNo);
                                }
                            }
                            else {
                                if (ResultArrayObjOne.length > 0) {
                                    this.changedSlots = ResultArrayObjOne;
                                }
                                if (ResultArrayObjTwo.length > 0) {
                                    this.changedSlots = ResultArrayObjTwo;
                                }
                                newChange = true;
                                //this.changedSlots = readerResponse;
                            }
                            if (newChange) {
                                // Replace previous list with new list from reader
                                this.previousScan = readerResponse_1;
                                this.change = true;
                            }
                        }
                        this.lock = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Responsible for gathering tags from service (reader) and manages the detection of new tags for 10x1 reader
    PositionalScanner.prototype.scanTenByOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var newChange, readerResponse_2, ResultArrayObjOne, ResultArrayObjTwo, _loop_2, this_2, containsTag, antennaNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.lock) return [3 /*break*/, 2];
                        this.lock = true;
                        newChange = false;
                        return [4 /*yield*/, this.reader.getInventory().catch(function (error) {
                                throw error;
                            })];
                    case 1:
                        readerResponse_2 = _a.sent();
                        ResultArrayObjOne = readerResponse_2.filter(function (_a) {
                            var newreading = _a.antenna;
                            return !_this.previousScan.some(function (_a) {
                                var previousreading = _a.antenna;
                                return previousreading === newreading;
                            });
                        });
                        ResultArrayObjTwo = this.previousScan.filter(function (_a) {
                            var previousreading = _a.antenna;
                            return !readerResponse_2.some(function (_a) {
                                var newreading = _a.antenna;
                                return previousreading === newreading;
                            });
                        });
                        if (ResultArrayObjOne.length > 0 || ResultArrayObjTwo.length > 0) {
                            this.changedSlots = [];
                            // First read?
                            if (this.previousScan.length !== 0 && this.keepPreviousScan) {
                                _loop_2 = function (antennaNo) {
                                    var thisRead = readerResponse_2.find(function (inv) { return inv.antenna === (antennaNo + 1); });
                                    var lastRead = this_2.previousScan.find(function (inv) { return inv.antenna === (antennaNo + 1); });
                                    containsTag = false;
                                    // Is there a tag at this antenna?
                                    if (thisRead && thisRead.hasOwnProperty("UID")) {
                                        if (readerResponse_2.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.length !== 0) {
                                            containsTag = true;
                                        }
                                    }
                                    // Was there a tag at this antenna on the last read?
                                    if (lastRead && lastRead.hasOwnProperty("UID") && lastRead.UID.length !== 0) {
                                        // Is there a tag now?
                                        if (containsTag) {
                                            // Is it not the same tag?
                                            if (!readerResponse_2.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.find(function (newTag) { return newTag === (_this.previousScan.find(function (inv) { return inv.antenna === (antennaNo + 1); }).UID.find(function (lastTag) { return lastTag === newTag; })); })) {
                                                newChange = true;
                                                this_2.changedSlots.push(readerResponse_2.find(function (inv) { return inv.antenna === (antennaNo + 1); }));
                                            }
                                        } // There is no tag on that antenna now
                                        else {
                                            newChange = true;
                                            // Enter missing tag
                                            var inv = new inventory_1.Inventory();
                                            inv.antenna = antennaNo + 1;
                                            this_2.changedSlots.push((inv));
                                        }
                                    } // There was no tag on that antenna before
                                    else {
                                        // Change has occurred if new tag has appeared
                                        if (containsTag) {
                                            newChange = true;
                                            this_2.changedSlots.push(readerResponse_2.find(function (inv) { return inv.antenna === (antennaNo + 1); }));
                                        }
                                    }
                                };
                                this_2 = this;
                                // Reset new found tags list
                                for (antennaNo = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {
                                    _loop_2(antennaNo);
                                }
                            }
                            else {
                                if (ResultArrayObjOne.length > 0) {
                                    this.changedSlots = ResultArrayObjOne;
                                }
                                if (ResultArrayObjTwo.length > 0) {
                                    this.changedSlots = ResultArrayObjTwo;
                                }
                                newChange = true;
                                //this.changedSlots = readerResponse;
                            }
                            if (newChange) {
                                // Replace previous list with new list from reader
                                this.previousScan = readerResponse_2;
                                this.change = true;
                            }
                        }
                        this.lock = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PositionalScanner.prototype.setChange = function (value) {
        this.change = value;
    };
    PositionalScanner.prototype.clear = function () {
        this.change = false;
        // this.changedSlots = [];
        this.previousScan = [];
    };
    return PositionalScanner;
}());
exports.PositionalScanner = PositionalScanner;
//# sourceMappingURL=positional-scanner.js.map