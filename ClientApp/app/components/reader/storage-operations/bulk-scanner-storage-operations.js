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
var Bulkscanner = require("../scanner/bulk-scanner");
var BulkScanner = Bulkscanner.BulkScanner;
var Server = require("../../api/server");
var Jsonmap = require("../../api/json-map");
var Reader = require("../../api/reader");
var Http_GetItems = Server.Http_GetItems;
var toastr = require("toastr");
var server_1 = require("../../api/server");
var BulkScannerStorageOperations = /** @class */ (function (_super) {
    __extends(BulkScannerStorageOperations, _super);
    function BulkScannerStorageOperations(readerId) {
        var _this = _super.call(this, readerId) || this;
        _this.status = "Please scan items to begin";
        _this.canUpdateDb = false;
        _this.foundItems = [];
        _this.newSample = new Map();
        return _this;
    }
    BulkScannerStorageOperations.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Initialise reader & set properties
                    return [4 /*yield*/, this.init()];
                    case 1:
                        // Initialise reader & set properties
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Entry of new Containers
    BulkScannerStorageOperations.prototype.assignment = function (requiredItems) {
        return __awaiter(this, void 0, void 0, function () {
            var tagIdentity, recognized, tagIdent, tagType, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Scan the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 10];
                        this.setChange(false);
                        if (!(this.newTags[0].UID.length === 1)) return [3 /*break*/, 9];
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(this.newTags)];
                    case 2:
                        tagIdentity = _a.sent();
                        recognized = tagIdentity.Tags[0] !== null;
                        if (!!recognized) return [3 /*break*/, 7];
                        return [4 /*yield*/, Reader.Reader_Ident(this.reader.readerId, this.newTags[0].UID[0]).catch(function (error) {
                                console.log(error);
                                toastr.warning("Item removed too quickly!");
                            })];
                    case 3:
                        tagIdent = _a.sent();
                        if (!(tagIdent != undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, server_1.Http_GetTagIdentTypeDesc(tagIdent.Ident)];
                    case 4:
                        tagType = _a.sent();
                        // If type recongised
                        if (tagType !== undefined) {
                            // If the ident (tag) is the one we're looking for (required)
                            if (requiredItems.find(function (type) { return type === tagType; })) {
                                this.status = tagType + " Detected";
                                // Set the sample UID and ident in memory
                                this.newSample.set(this.newTags[0].UID[0], parseInt(tagIdent.Ident, 16));
                                this.canUpdateDb = true;
                            }
                            else {
                                this.status = "Wrong type of Container presented: " + tagType;
                                this.canUpdateDb = false;
                            }
                        }
                        else {
                            this.status = "RFID Tag not recognised!";
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        this.clear();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags[0]);
                        this.status = resp.description + " already in database!";
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (this.previousScan[0].UID.length === 0) {
                            this.status = "Please present the tagged item to the Reader";
                        }
                        else {
                            this.status = "Items must be read individually";
                        }
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // Used for operations where items read need to be compared to list i.e Pick List
    BulkScannerStorageOperations.prototype.scanAgainestList = function (list, listItemsParents, requiredItems, newParentItems) {
        return __awaiter(this, void 0, void 0, function () {
            var tagIdentities, _a, _b, _i, tag, recognized, found, _c, _d, _e, item;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: 
                    // Scan the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _f.sent();
                        if (!this.change) return [3 /*break*/, 13];
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(this.newTags)];
                    case 2:
                        tagIdentities = _f.sent();
                        _a = [];
                        for (_b in tagIdentities.Tags)
                            _a.push(_b);
                        _i = 0;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        tag = _a[_i];
                        recognized = tagIdentities.Tags[tag] !== null;
                        if (!recognized) return [3 /*break*/, 10];
                        found = false;
                        _c = [];
                        for (_d in list)
                            _c.push(_d);
                        _e = 0;
                        _f.label = 4;
                    case 4:
                        if (!(_e < _c.length)) return [3 /*break*/, 9];
                        item = _c[_e];
                        if (!(tagIdentities.Tags[tag].Uid === list[item].uid)) return [3 /*break*/, 5];
                        // Select item on table
                        list[item].$isSelected = true;
                        found = true;
                        this.foundItems.push(tagIdentities.Tags[tag]);
                        return [3 /*break*/, 9];
                    case 5:
                        if (!this.tagIsParent(tagIdentities.Tags[tag].Uid, listItemsParents)) return [3 /*break*/, 6];
                        found = true;
                        this.foundItems.push(tagIdentities.Tags[tag]);
                        return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, this.tagIsChild(tagIdentities.Tags[tag].Uid, list)];
                    case 7:
                        if (_f.sent()) {
                            found = true;
                            this.foundItems.push(tagIdentities.Tags[tag]);
                            return [3 /*break*/, 9];
                        }
                        else if (newParentItems) {
                            if (newParentItems.findIndex(function (type) { return type === tagIdentities.Tags[tag].ContainerType; }) !== -1) {
                                found = true;
                                this.foundItems.push(tagIdentities.Tags[tag]);
                                return [3 /*break*/, 9];
                            }
                        }
                        _f.label = 8;
                    case 8:
                        _e++;
                        return [3 /*break*/, 4];
                    case 9:
                        if (!found) {
                            toastr.error("Item not on the list");
                        }
                        if (!this.canUpdateDb) {
                            // Have all of the secondary storage items been read?
                            if (this.requireItemsFound(requiredItems)) {
                                // Have any items from the list been scanned
                                if (this.foundItems.some(function (tag) { return list.findIndex(function (item) { return item.uid === tag.Uid; }) !== -1; })) {
                                    this.canUpdateDb = true;
                                    this.status = "Please select the confirm button to continue";
                                }
                            }
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        toastr.error("Item Not Recognised! Please use the assignment operation to register the item in the database");
                        return [3 /*break*/, 12];
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12:
                        this.setChange(false);
                        _f.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    // Booking of Samples in & out of storage 
    BulkScannerStorageOperations.prototype.bookingInOut = function (requiredItems) {
        return __awaiter(this, void 0, void 0, function () {
            var tagIdentities, tag, recognized, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Scan the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 3];
                        this.setChange(false);
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(this.newTags)];
                    case 2:
                        tagIdentities = _a.sent();
                        for (tag in tagIdentities.Tags) {
                            recognized = tagIdentities.Tags[tag] !== null;
                            if (recognized) {
                                // If not already on list add it
                                if (!this.foundItems.find(function (item) { return item.Uid === tagIdentities.Tags[tag].Uid; })) {
                                    item = tagIdentities.Tags[tag];
                                    // Make primary samples selected - TODO Replace with a call for primary container types to db
                                    if (tagIdentities.Tags[tag].ContainerType === 'Vial' || tagIdentities.Tags[tag].ContainerType === 'Straw') {
                                        item.$isSelected = true;
                                    }
                                    this.foundItems.push(item);
                                }
                            }
                            else {
                                toastr.error("Item Not Recognised! Please use the assignment operation to register the item in the database");
                                break;
                            }
                        }
                        if (!this.canUpdateDb) {
                            // Have all of the storage items been read?
                            if (this.requireItemsFound(requiredItems)) {
                                this.canUpdateDb = true;
                                this.status = "Please select the Store/Withdraw button to store/remove selected samples";
                            }
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BulkScannerStorageOperations.prototype.scanForKnownItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tagIdentities, tag, recognized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.scan()];
                    case 1:
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 3];
                        return [4 /*yield*/, Server.Http_GetTagsIdentity(this.newTags)];
                    case 2:
                        tagIdentities = _a.sent();
                        if (tagIdentities.hasOwnProperty('Tags')) {
                            for (tag in tagIdentities.Tags) {
                                recognized = tagIdentities.Tags[tag] !== null;
                                // Determine if new read items are on the list and make them selected
                                if (recognized) {
                                    this.foundItems.push(tagIdentities.Tags[tag]);
                                    this.canUpdateDb = true;
                                }
                                else {
                                    toastr.warning("Item not in database!");
                                }
                            }
                        }
                        this.setChange(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Determines if all of the storage items been read
    BulkScannerStorageOperations.prototype.requireItemsFound = function (items) {
        // Loop through the storage items required and determine if all have been found
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var requiredItem = items_1[_i];
            var noOfRequiredItem = this.foundItems.filter(function (it) { return it.ContainerType === requiredItem; }).length;
            // If only one of the particular item has been read
            if (noOfRequiredItem === 1) {
                continue;
            }
            else if (this.foundItems.filter(function (it) { return it.ContainerType === requiredItem; }).length > 1) {
                toastr.error("Detected too many of type ", requiredItem);
                return false;
            }
            else if (this.foundItems.filter(function (it) { return it.ContainerType === requiredItem; }).length === 0) {
                if (requiredItem === 'Sample') {
                    // TODO Replace with a call for primary container types to db
                    if (this.foundItems.filter(function (it) { return it.ContainerType === 'Vial' || it.ContainerType === 'Straw'; }).length !== 0) {
                        continue;
                    }
                    else {
                        this.status = "Please scan a " + requiredItem;
                        return false;
                    }
                }
                this.status = "Please scan a " + requiredItem;
                return false;
            }
        }
        return true;
    };
    // Determines if a tag is the child of the item on the list
    BulkScannerStorageOperations.prototype.tagIsChild = function (tagUid, list) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, item, containerChildren, children;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in list)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        item = _a[_i];
                        return [4 /*yield*/, Http_GetItems("Containers?UIDS=" + list[item].uid)];
                    case 2:
                        containerChildren = _c.sent();
                        for (children in containerChildren.Containers) {
                            if (containerChildren.Containers[children].Uid === tagUid) {
                                this.status = "Detected " + containerChildren.Containers[children].Description;
                                return [2 /*return*/, true];
                            }
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    //  Determines if a tag is a parent of an item on the list?
    BulkScannerStorageOperations.prototype.tagIsParent = function (tagUid, allListParents) {
        for (var itemsAncestory in allListParents) {
            for (var parent in allListParents[itemsAncestory]) {
                if (allListParents[itemsAncestory][parent].uid === tagUid) {
                    this.status = "Detected " + allListParents[itemsAncestory][parent].name;
                    return true;
                }
            }
        }
        return false;
    };
    return BulkScannerStorageOperations;
}(BulkScanner));
exports.BulkScannerStorageOperations = BulkScannerStorageOperations;
//# sourceMappingURL=bulk-scanner-storage-operations.js.map