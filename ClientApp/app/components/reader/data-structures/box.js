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
var slot_1 = require("./slot");
var Slotstates = require("./slot-states");
var SlotStates = Slotstates.SlotStates;
var server_1 = require("../../api/server");
var Box = /** @class */ (function () {
    function Box(slotQty) {
        // Reserved slot for box tag
        this.reservedPosition = 1;
        // Initialise slots array
        this.slots = [];
        for (var s = 0; s < slotQty; s++) {
            var slot = new slot_1.Slot();
            slot.slotNumber = s + 1;
            // Set all states to empty 
            slot.slotState = SlotStates.EMPTY;
            this.slots.push(slot);
        }
    }
    Box.prototype.setUid = function (uid) {
        this.uid = uid;
        this.slots.forEach(function (slot) { return slot.storageItemUid = uid; });
    };
    // Set the reserved slot for the box
    Box.prototype.setReservedSlot = function () {
        var _this = this;
        var index = this.slots.findIndex(function (posn) { return posn.slotNumber === _this.reservedPosition; });
        this.slots[index].setObservedUid(this.uid);
        this.slots[index].setRecordedUid(this.uid);
        this.slots[index].slotState = SlotStates.STORAGE_TAG;
    };
    // Get all storage containers belonging to box
    Box.prototype.getBoxContentsfromDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetParentPrimaryContainers(this.uid).catch(function (error) { console.log(error); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Set the slots recorded containers the database response of the contents of the box
    Box.prototype.setBoxRecordedContents = function (boxContents) {
        // Reset all recorded uids
        this.slots.forEach(function (slot) { return slot.setRecordedUid(''); });
        // For every slot in the box set the recorded item.
        for (var container in boxContents) {
            this.slots.find(function (posn) { return posn.slotNumber === boxContents[container].Position; }).setRecordedUid(boxContents[container].Uid);
            this.slots.find(function (posn) { return posn.slotNumber === boxContents[container].Position; }).setRecordedContainer(boxContents[container]);
        }
    };
    // Before processing of the updated slots occurs set their state to loading 
    Box.prototype.setSlotsToLoading = function (updatedSlots) {
        var _this = this;
        // Set all updated slots to loading status
        var slotNumbers = updatedSlots.filter(function (tag) { return _this.slots.find(function (slot) { return (slot.slotNumber === tag.antenna) && (slot.slotNumber !== _this.reservedPosition); }); });
        slotNumbers.forEach(function (slotNo) { return _this.slots.find(function (slot) { return slot.slotNumber === slotNo.antenna; }).slotState = SlotStates.LOADING; });
    };
    // Updates the slots when the reader output changes
    Box.prototype.setBoxObservedContents = function (updatedSlots) {
        return __awaiter(this, void 0, void 0, function () {
            var notCorrectlyStoredTags, tagsIdentity, _a, s, index, tagIdentidy;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        notCorrectlyStoredTags = this.filterTagsNotCorrectlyStored(updatedSlots);
                        if (!(notCorrectlyStoredTags.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, server_1.Http_PostTagsIdentity(notCorrectlyStoredTags)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3:
                        tagsIdentity = _a;
                        // Poll the observed uids
                        for (s in updatedSlots) {
                            // Ignore slot reserved for box tag
                            if (updatedSlots[s].antenna !== this.reservedPosition) {
                                index = this.slots.findIndex(function (posn) { return posn.slotNumber === updatedSlots[s].antenna; });
                                // Set observed UID
                                if (updatedSlots[s].hasOwnProperty('UID')) {
                                    // Tag is present
                                    this.slots[index].setObservedUid(updatedSlots[s].UID[0]);
                                    // If tag is in db
                                    if (tagsIdentity && tagsIdentity.hasOwnProperty('Tags')) {
                                        tagIdentidy = tagsIdentity.Tags.find(function (cont) { return cont !== null && cont.Uid === updatedSlots[s].UID[0]; });
                                        // Set the observed container
                                        tagIdentidy ? this.slots[index].setObservedContainer(tagIdentidy) : this.slots[index].observedContainer = null;
                                    }
                                }
                                else {
                                    // Slot is empty
                                    this.slots[index].setObservedUid('');
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Box.prototype.updateAllSlots = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, slot;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.slots)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        slot = _a[_i];
                        if (!(this.slots[slot].slotNumber !== this.reservedPosition)) return [3 /*break*/, 3];
                        // Update State
                        return [4 /*yield*/, this.slots[slot].updateSlotState()];
                    case 2:
                        // Update State
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Filter array for tags that are present and not correctly stored
    Box.prototype.filterTagsNotCorrectlyStored = function (tags) {
        var _this = this;
        // Find all tags that are present
        var presentTags = tags.filter(function (slot) { return slot.hasOwnProperty('UID') && slot.UID.length !== 0; });
        // Filter present tags by checking their found uid is equal to their recorded uid
        return presentTags.filter(function (tag) { return _this.slots.find(function (slot) { return slot.slotNumber === tag.antenna && (slot.getRecordedUid() !== tag.UID[0]); }); });
    };
    return Box;
}());
exports.Box = Box;
//# sourceMappingURL=box.js.map