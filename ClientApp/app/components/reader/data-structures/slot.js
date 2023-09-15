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
var slot_states_1 = require("./slot-states");
var server_1 = require("../../api/server");
var toastr = require("toastr");
var json_map_1 = require("../../api/json-map");
var Slot = /** @class */ (function () {
    function Slot() {
        // Default to empty
        this.recordedUid = '';
        this.observedUid = '';
    }
    // Where the recorded uid is what the database says is the uid in this slot
    Slot.prototype.getRecordedUid = function () { return this.recordedUid; };
    Slot.prototype.setRecordedUid = function (uid) { this.recordedUid = uid; };
    // Where the observed uid is what the reader says is the uid in this slot
    Slot.prototype.getObservedUid = function () { return this.observedUid; };
    Slot.prototype.setObservedUid = function (uid) { this.observedUid = uid; };
    // Updates the slot  state
    Slot.prototype.updateSlotState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.evaluateSlotState()];
                    case 1:
                        _a.slotState = _b.sent();
                        return [2 /*return*/, this.slotState];
                }
            });
        });
    };
    Slot.prototype.setAsEmpty = function () {
        this.slotState = slot_states_1.SlotStates.EMPTY;
        this.observedUid = "";
    };
    // Accesses the state of the slot
    Slot.prototype.evaluateSlotState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var recordedAsOccupied, tagInSlot;
            return __generator(this, function (_a) {
                recordedAsOccupied = !this.uidEmpty(this.recordedUid);
                tagInSlot = !this.uidEmpty(this.observedUid);
                // Database recorded a container in the slot and there is a tag in position
                if (recordedAsOccupied && tagInSlot) {
                    // Is the container in the right slot
                    if (this.containerCorrectlyStored()) {
                        return [2 /*return*/, slot_states_1.SlotStates.OCCUPIED];
                    }
                    else {
                        if (this.observedContainer !== null && this.observedContainer) {
                            // Tag in another tags slot
                            return [2 /*return*/, slot_states_1.SlotStates.RESERVED];
                        }
                        else {
                            // Tag in slot is not in db
                            return [2 /*return*/, slot_states_1.SlotStates.UNASSIGNED];
                        }
                    }
                }
                else if (!tagInSlot && recordedAsOccupied) {
                    return [2 /*return*/, slot_states_1.SlotStates.MISSING];
                }
                else if (!recordedAsOccupied && tagInSlot) {
                    if (this.observedContainer !== null && this.observedContainer) {
                        if (!this.isAlreadyStored(this.observedContainer)) {
                            return [2 /*return*/, slot_states_1.SlotStates.NEW];
                        }
                        else {
                            return [2 /*return*/, slot_states_1.SlotStates.MOVED];
                        }
                    }
                    else {
                        // Tag in slot is not in db
                        return [2 /*return*/, slot_states_1.SlotStates.UNASSIGNED];
                    }
                }
                else if (!recordedAsOccupied && !tagInSlot) {
                    // Empty slot
                    return [2 /*return*/, slot_states_1.SlotStates.EMPTY];
                }
                return [2 /*return*/];
            });
        });
    };
    // The tag being read by the reader is the same tag recorded in this slot in the database
    Slot.prototype.containerCorrectlyStored = function () {
        return (this.recordedUid === this.observedUid);
    };
    Slot.prototype.uidEmpty = function (uid) {
        return (uid === "") || (uid === undefined);
    };
    Slot.prototype.getContainerInSlot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.observedUid).then(function (data) {
                            // Valid response
                            if (data.hasOwnProperty('Tags')) {
                                return data.Tags[0];
                            }
                            else {
                                return null;
                            }
                        }).catch(function (error) {
                            toastr.error(error);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Slot.prototype.getContainerInDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.recordedUid).then(function (data) {
                            // Valid response
                            if (data.hasOwnProperty('Tags')) {
                                return data.Tags[0];
                            }
                            else {
                                return null;
                            }
                        }).catch(function (error) {
                            toastr.error(error);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Slot.prototype.setObservedContainer = function (item) {
        this.observedContainer = json_map_1.Server_ConvertToTagIdentity(item);
    };
    Slot.prototype.setRecordedContainer = function (item) {
        this.recordedContainer = json_map_1.Server_ConvertToTagIdentity(item);
    };
    // Checks if container is stored in a box
    Slot.prototype.isAlreadyStored = function (item) {
        return item.position !== 0;
    };
    return Slot;
}());
exports.Slot = Slot;
//# sourceMappingURL=slot.js.map