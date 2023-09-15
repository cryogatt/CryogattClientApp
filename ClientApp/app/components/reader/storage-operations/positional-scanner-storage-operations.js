"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Server = require("../../api/server");
var Jsonmap = require("../../api/json-map");
var Reader = require("../../api/reader");
var toastr = require("toastr");
var Positionalscanner = require("../scanner/positional-scanner");
var PositionalScanner = Positionalscanner.PositionalScanner;
var Containerstates = require("../data-structures/container-states");
var ContainerStates = Containerstates.ContainerStates;
var server_1 = require("../../api/server");
var PositionalScannerStorageOperations = /** @class */ (function (_super) {
    __extends(PositionalScannerStorageOperations, _super);
    /* private foundItemsNotInDb: Map<string, ContainerStates> = new Map<string, ContainerStates>();*/
    function PositionalScannerStorageOperations(readerId) {
        var _this = _super.call(this, readerId) || this;
        _this.newSample = new Map();
        _this.status = "";
        _this.canUpdateDb = false;
        _this.foundItems = [];
        _this.containerStates = [];
        _this.status = "Please scan an item";
        return _this;
    }
    // Initialise reader & set properties
    PositionalScannerStorageOperations.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PositionalScannerStorageOperations.prototype.assignmentTenByOne = function (requiredItems) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var newTags, tagIdentity, _a, antennaNo, _b, _c, _i, slot, position, _d, _e, _f, tag, tagUid, recognized, tagIdent, tagType, resp;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!!this.canUpdateDb) return [3 /*break*/, 12];
                        // Scan the reader
                        return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _g.sent();
                        if (!this.change) return [3 /*break*/, 12];
                        this.setChange(false);
                        this.foundItems = [];
                        this.canUpdateDb = true;
                        newTags = this.previousScan.filter(function (inv) { return inv.hasOwnProperty("UID") && inv.UID.length !== 0; });
                        if (!(newTags.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(newTags)];
                    case 2:
                        _a = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _g.label = 4;
                    case 4:
                        tagIdentity = _a;
                        this.containerStates = [];
                        // Build internal array that matches the array of antennas
                        for (antennaNo = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {
                            this.containerStates.push(ContainerStates.DEFAULT);
                        }
                        _b = [];
                        for (_c in this.previousScan)
                            _b.push(_c);
                        _i = 0;
                        _g.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 12];
                        slot = _b[_i];
                        position = this.previousScan[slot];
                        //If no tags on slot
                        if (!position.hasOwnProperty("UID") && position.UID.length !== 0) {
                            this.containerStates[this.previousScan[slot].antenna - 1] = ContainerStates.DEFAULT;
                            return [3 /*break*/, 11];
                        }
                        _d = [];
                        for (_e in this.previousScan[slot].UID)
                            _d.push(_e);
                        _f = 0;
                        _g.label = 6;
                    case 6:
                        if (!(_f < _d.length)) return [3 /*break*/, 11];
                        tag = _d[_f];
                        tagUid = this.previousScan[slot].UID[tag];
                        recognized = (tagIdentity.Tags.find(function (tag) { return tag !== null && tag.Uid === tagUid; }) !== undefined);
                        if (!!recognized) return [3 /*break*/, 9];
                        return [4 /*yield*/, Reader.Reader_Ident(this.reader.readerId, tagUid, position.antenna)
                                .catch(function (error) {
                                toastr.error("Item moved while trying to interrogate its ident!");
                                _this.status = "Error occurred!";
                                // throw error;
                            })];
                    case 7:
                        tagIdent = _g.sent();
                        return [4 /*yield*/, server_1.Http_GetTagIdentTypeDesc(tagIdent.Ident)
                                .catch(function (error) {
                                toastr.error(error);
                                throw error;
                            })];
                    case 8:
                        tagType = _g.sent();
                        // If type recongised
                        if (tagType !== undefined) {
                            // If the ident (tag) is the one we're looking for (required)
                            if (requiredItems.find(function (type) { return type === tagType; })) {
                                this.status = tagType + " detected in position " + (position.antenna);
                                this.containerStates[position.antenna - 1] = ContainerStates.UNFILLED;
                                // Set the sample UID and ident in memory
                                this.newSample.set(tagUid, parseInt(tagIdent.Ident, 16));
                            }
                            else {
                                this.containerStates[position.antenna - 1] = ContainerStates.ERROR;
                                this.status = "Wrong type of item: " + tagType;
                                this.newSample.set(tagUid, -1);
                                //this.canUpdateDb = false;
                            }
                        }
                        else {
                            this.containerStates[position.antenna - 1] = ContainerStates.INVAILD;
                            this.status = "RFID Tag not recognised!";
                            this.newSample.set(tagUid, -1);
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        this.containerStates[position.antenna - 1] = ContainerStates.FILLED;
                        resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags.find(function (tag) { return tag !== null && tag.Uid === tagUid; }));
                        resp.position = position.antenna;
                        this.status = resp.description + " already in database!";
                        this.foundItems[position.antenna - 1] = resp;
                        _g.label = 10;
                    case 10:
                        _f++;
                        return [3 /*break*/, 6];
                    case 11:
                        _i++;
                        return [3 /*break*/, 5];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // Entry of new Containers
    PositionalScannerStorageOperations.prototype.assignment = function (requiredItems) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var newTags, tagIdentity, _a, _b, _c, _i, slot, position, _d, _e, _f, tag, tagUid, recognized, tagIdent, tagType, resp;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!!this.canUpdateDb) return [3 /*break*/, 12];
                        // Scan the reader
                        return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _g.sent();
                        if (!this.change) return [3 /*break*/, 12];
                        this.setChange(false);
                        newTags = this.changedSlots.filter(function (inv) { return inv.hasOwnProperty("UID") && inv.UID.length !== 0; });
                        if (!(newTags.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(newTags)];
                    case 2:
                        _a = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _g.label = 4;
                    case 4:
                        tagIdentity = _a;
                        _b = [];
                        for (_c in this.changedSlots)
                            _b.push(_c);
                        _i = 0;
                        _g.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 12];
                        slot = _b[_i];
                        position = this.changedSlots[slot];
                        //If no tags on slot
                        if (!position.hasOwnProperty("UID") && position.UID.length !== 0) {
                            this.containerStates[this.changedSlots[slot].antenna - 1] = ContainerStates.DEFAULT;
                            return [3 /*break*/, 11];
                        }
                        _d = [];
                        for (_e in this.changedSlots[slot].UID)
                            _d.push(_e);
                        _f = 0;
                        _g.label = 6;
                    case 6:
                        if (!(_f < _d.length)) return [3 /*break*/, 11];
                        tag = _d[_f];
                        tagUid = this.changedSlots[slot].UID[tag];
                        recognized = (tagIdentity.Tags.find(function (tag) { return tag !== null && tag.Uid === tagUid; }) !== undefined);
                        if (!!recognized) return [3 /*break*/, 9];
                        return [4 /*yield*/, Reader.Reader_Ident(this.reader.readerId, tagUid, position.antenna)
                                .catch(function (error) {
                                toastr.error("Item moved while trying to interrogate its ident!");
                                _this.status = "Error occurred!";
                                throw error;
                            })];
                    case 7:
                        tagIdent = _g.sent();
                        return [4 /*yield*/, server_1.Http_GetTagIdentTypeDesc(tagIdent.Ident)
                                .catch(function (error) {
                                toastr.error(error);
                                throw error;
                            })];
                    case 8:
                        tagType = _g.sent();
                        // If type recongised
                        if (tagType !== undefined) {
                            // If the ident (tag) is the one we're looking for (required)
                            if (requiredItems.find(function (type) { return type === tagType; })) {
                                this.status = tagType + " detected in position " + (position.antenna);
                                this.containerStates[position.antenna - 1] = ContainerStates.UNFILLED;
                                // Set the sample UID and ident in memory
                                this.newSample.set(tagUid, parseInt(tagIdent.Ident, 16));
                                this.canUpdateDb = true;
                            }
                            else {
                                this.containerStates[position.antenna - 1] = ContainerStates.ERROR;
                                this.status = "Wrong type of item: " + tagType;
                                this.canUpdateDb = false;
                            }
                        }
                        else {
                            this.containerStates[position.antenna - 1] = ContainerStates.INVAILD;
                            this.status = "RFID Tag not recognised!";
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        this.containerStates[position.antenna - 1] = ContainerStates.FILLED;
                        resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags.find(function (tag) { return tag !== null && tag.Uid === tagUid; }));
                        this.status = resp.description + " already in database!";
                        _g.label = 10;
                    case 10:
                        _f++;
                        return [3 /*break*/, 6];
                    case 11:
                        _i++;
                        return [3 /*break*/, 5];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    PositionalScannerStorageOperations.prototype.scanAgainestList = function (list, listItemsParents, requiredItems) {
        toastr.error("Whoops! This readers does not support this operation.");
    };
    PositionalScannerStorageOperations.prototype.bookingInOut = function (requiredItems) {
        toastr.error("Whoops! This readers does not support this operation.");
    };
    return PositionalScannerStorageOperations;
}(PositionalScanner));
exports.PositionalScannerStorageOperations = PositionalScannerStorageOperations;
//# sourceMappingURL=positional-scanner-storage-operations.js.map