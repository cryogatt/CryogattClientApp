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
var TypeState_1 = require("TypeState");
var positional_scanner_1 = require("../positional-scanner");
var reader_1 = require("../../../api/reader");
var server_1 = require("../../../api/server");
var json_map_1 = require("../../../api/json-map");
var box_states_1 = require("../../data-structures/box-states");
var box_1 = require("../../data-structures/box");
// Handles the box and sets the recorded UID of the box contents
var BoxPositionalStorageScanner = /** @class */ (function (_super) {
    __extends(BoxPositionalStorageScanner, _super);
    function BoxPositionalStorageScanner(readerType) {
        var _this = 
        // Initailise the reader
        _super.call(this, readerType) || this;
        // Construct the FSM with the inital state, in this case the box reader starts without a box found
        _this.fsm = new TypeState_1.TypeState.FiniteStateMachine(box_states_1.BoxStates.NO_BOX_SIG);
        // Declare the valid state transitions to model your system - No box to different box states
        _this.fsm.from(box_states_1.BoxStates.NO_BOX_SIG).to(box_states_1.BoxStates.KNOWN_BOX_SIG);
        _this.fsm.from(box_states_1.BoxStates.NO_BOX_SIG).to(box_states_1.BoxStates.UNKNOWN_BOX_SIG);
        _this.fsm.from(box_states_1.BoxStates.NO_BOX_SIG).to(box_states_1.BoxStates.BAD_TAG_SIG);
        // Box to no box, assumes a reading will occour before someone can switch boxes - reduces complexity
        _this.fsm.fromAny(box_states_1.BoxStates).to(box_states_1.BoxStates.NO_BOX_SIG);
        _this.fsm.from(box_states_1.BoxStates.NO_BOX_SIG).toAny(box_states_1.BoxStates);
        _this.fsm.fromAny(box_states_1.BoxStates).toAny(box_states_1.BoxStates);
        // Declare listeners
        _this.fsm.on(box_states_1.BoxStates.NO_BOX_SIG, function (from) {
            _this.noBox();
        });
        _this.fsm.on(box_states_1.BoxStates.BAD_TAG_SIG, function (from) {
            _this.badTag();
        });
        _this.fsm.on(box_states_1.BoxStates.BOX_CHANGED_SIG, function (from) {
            _this.boxChanged();
        });
        _this.fsm.onEnter(box_states_1.BoxStates.KNOWN_BOX_SIG, function (from) {
            _this.keepPreviousScan = true;
            _this.knownBox();
            // To satisfy condition - TODO maybe use this as opportunity to ensure the data is valid?
            return true;
        });
        _this.fsm.onExit(box_states_1.BoxStates.KNOWN_BOX_SIG, function (from) {
            _this.keepPreviousScan = false;
            // To satisfy condition - TODO maybe use this as opportunity to ensure the data is valid?
            return true;
        });
        _this.fsm.on(box_states_1.BoxStates.UNKNOWN_BOX_SIG, function (from) {
            _this.unknownBox();
        });
        return _this;
    }
    BoxPositionalStorageScanner.prototype.initBoxScanner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Initialise reader settings
                    return [4 /*yield*/, this.init()];
                    case 1:
                        // Initialise reader settings
                        _a.sent();
                        // Set default values for interal variables
                        this.resetVariables();
                        this.box = new box_1.Box(this.reader.antennaQuantity);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Main loop
    BoxPositionalStorageScanner.prototype.scanBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.reservedPosnChanged()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setBoxState()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.fsm.currentState];
                }
            });
        });
    };
    // Logic for determining box state
    BoxPositionalStorageScanner.prototype.setBoxState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tagInPosn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.tagInBoxPosition()) return [3 /*break*/, 5];
                        tagInPosn = this.getTagInBoxPosition();
                        return [4 /*yield*/, this.tagIsBox(tagInPosn)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        // Set the box UID
                        this.box.setUid(tagInPosn);
                        // Has a box been read since program started 
                        if (this.storageItem) {
                            // Is it the same box that was read last time
                            if (this.box.uid !== this.storageItem.uid) {
                                // Reset internal variables if box has changed
                                this.fsm.go(box_states_1.BoxStates.BOX_CHANGED_SIG);
                            }
                        }
                        return [4 /*yield*/, this.isKnownBox(tagInPosn)];
                    case 2:
                        (_a.sent()) ? this.fsm.go(box_states_1.BoxStates.KNOWN_BOX_SIG) : this.fsm.go(box_states_1.BoxStates.UNKNOWN_BOX_SIG);
                        return [3 /*break*/, 4];
                    case 3:
                        this.fsm.go(box_states_1.BoxStates.BAD_TAG_SIG);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        // Condition incase state is already set
                        if (this.fsm.currentState !== box_states_1.BoxStates.NO_BOX_SIG) {
                            this.fsm.go(box_states_1.BoxStates.NO_BOX_SIG);
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BoxPositionalStorageScanner.prototype.boxChanged = function () {
        this.resetVariables();
        this.clear();
    };
    BoxPositionalStorageScanner.prototype.noBox = function () {
        this.resetVariables();
    };
    BoxPositionalStorageScanner.prototype.badTag = function () {
        this.resetVariables();
    };
    BoxPositionalStorageScanner.prototype.unknownBox = function () {
        this.resetVariables();
        // Set the attributes of new box for assignment
        this.storageItem = { 'Uid': this.box.uid, 'TagIdent': parseInt(this.tagIdent, 16) };
    };
    BoxPositionalStorageScanner.prototype.knownBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateBoxContents()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Calls the database and sets the recorded uid of the slots
    BoxPositionalStorageScanner.prototype.updateBoxContents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var boxContents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.box.getBoxContentsfromDb()];
                    case 1:
                        boxContents = _a.sent();
                        if (boxContents && boxContents.hasOwnProperty('PrimaryContainers')) {
                            // Set the storage item contents 
                            this.storageItemContents = json_map_1.Server_ConvertToPrimaryContainers(boxContents);
                            // Set the recorded contents of the box
                            this.box.setBoxRecordedContents(boxContents.PrimaryContainers);
                            // Set the reserved slot for the box
                            this.box.setReservedSlot();
                            // Set the storage item to found
                            this.storageItemFound = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Has there been an update the reserved slot
    BoxPositionalStorageScanner.prototype.reservedPosnChanged = function () {
        var _this = this;
        return (this.changedSlots.find(function (slot) { return slot.antenna === _this.box.reservedPosition; }) !== undefined || this.previousScan.find(function (slot) { return slot.antenna === _this.box.reservedPosition; }) === undefined);
    };
    // Is the box in the database?
    BoxPositionalStorageScanner.prototype.isKnownBox = function (boxUid) {
        return __awaiter(this, void 0, void 0, function () {
            var found, box, parent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        found = false;
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(boxUid).catch(function (error) {
                                console.log(error);
                                return false;
                            })];
                    case 1:
                        box = _a.sent();
                        if (!box.hasOwnProperty('Tags')) return [3 /*break*/, 3];
                        // Valid tag
                        if (box.Tags[0] === null) {
                            return [2 /*return*/, false];
                        }
                        found = true;
                        this.storageItem = json_map_1.Server_ConvertToTagIdentity(box.Tags[0]);
                        if (!(this.storageItem.parentUidDescription.size > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.storageItem.parentUidDescription.entries().next().value[0]).catch(function (error) { console.log(error); })];
                    case 2:
                        parent = _a.sent();
                        // Set storage item parent
                        if (box.Tags[0] !== null) {
                            this.storageItemParent = json_map_1.Server_ConvertToTagIdentity(parent.Tags[0]);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, found];
                }
            });
        });
    };
    // Is allocated slot for box taken?
    BoxPositionalStorageScanner.prototype.tagInBoxPosition = function () {
        var _this = this;
        var slotInv = this.changedSlots.find(function (slot) { return slot.antenna === _this.box.reservedPosition; });
        // Not in list
        if (slotInv === undefined || slotInv === null) {
            return false;
        }
        ;
        // Has no uid property
        if (!slotInv.hasOwnProperty("UID")) {
            return false;
        }
        // Has more or less than one tag in position
        return (slotInv.UID.length === 1);
    };
    // Get the tag Uid in box position 
    BoxPositionalStorageScanner.prototype.getTagInBoxPosition = function () {
        var _this = this;
        return this.changedSlots.find(function (slot) { return slot.antenna === _this.box.reservedPosition; }).UID[0];
    };
    // Is the tag in the box slot a box
    BoxPositionalStorageScanner.prototype.tagIsBox = function (boxUid) {
        return __awaiter(this, void 0, void 0, function () {
            var isBox, tagIdentResp, tagType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isBox = false;
                        return [4 /*yield*/, reader_1.Reader_Ident(this.reader.readerId, boxUid).catch(function (error) {
                                console.log(error);
                                return false;
                            })];
                    case 1:
                        tagIdentResp = _a.sent();
                        if (!tagIdentResp.hasOwnProperty('Ident')) return [3 /*break*/, 3];
                        this.tagIdent = tagIdentResp.Ident;
                        // Is Ident set
                        if (this.tagIdent === "00000000") {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, server_1.Http_GetTagIdentTypeDesc(this.tagIdent).catch(function (error) {
                                console.log(error);
                                return false;
                            })];
                    case 2:
                        tagType = _a.sent();
                        isBox = tagType === "Box"; //TODO CHANGE BACK TO BOX!
                        _a.label = 3;
                    case 3: return [2 /*return*/, isBox];
                }
            });
        });
    };
    // Resets variables to default;
    BoxPositionalStorageScanner.prototype.resetVariables = function () {
        this.storageItemFound = false;
        this.storageItemContents = [];
        this.storageItem = undefined;
        this.emptySlots();
    };
    BoxPositionalStorageScanner.prototype.emptySlots = function () {
        if (this.box) {
            // Set all slot states to empty - Assumes one slot per antenna
            for (var slot in this.box.slots) {
                this.box.slots[slot].setAsEmpty();
            }
        }
    };
    return BoxPositionalStorageScanner;
}(positional_scanner_1.PositionalScanner));
exports.BoxPositionalStorageScanner = BoxPositionalStorageScanner;
//# sourceMappingURL=box-positional-storage-scanner.js.map