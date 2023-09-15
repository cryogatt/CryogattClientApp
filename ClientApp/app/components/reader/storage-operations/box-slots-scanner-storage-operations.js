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
var box_slots_positional_storage_scanner_1 = require("../scanner/positional-storage-scanner/box-slots-positional-storage-scanner");
var toastr = require("toastr");
var slot_states_1 = require("../data-structures/slot-states");
var BoxSlotsScannerStorageOperations = /** @class */ (function (_super) {
    __extends(BoxSlotsScannerStorageOperations, _super);
    function BoxSlotsScannerStorageOperations(readerType) {
        // Initailise the reader
        return _super.call(this, readerType) || this;
    }
    BoxSlotsScannerStorageOperations.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initBoxSlotScanner()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsScannerStorageOperations.prototype.assignment = function (requiredItems) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                toastr.error("Whoops! This readers does not support this operation.");
                return [2 /*return*/];
            });
        });
    };
    BoxSlotsScannerStorageOperations.prototype.scanAgainestList = function (list) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Poll the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Poll the reader
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 3];
                        // Scan the box
                        return [4 /*yield*/, this.scanBoxSlots()];
                    case 2:
                        // Scan the box
                        _a.sent();
                        // Change the state for all items in list
                        this.setListItemsState(list);
                        // Evaluate and set the operations priority 
                        this.priority = this.evaluateOperationPriority();
                        this.setChange(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsScannerStorageOperations.prototype.bookingInOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Poll the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Poll the reader
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 3];
                        // Scan the box
                        return [4 /*yield*/, this.scanBoxSlots()];
                    case 2:
                        // Scan the box
                        _a.sent();
                        // Evaluate and set the operations priority
                        this.priority = this.evaluateOperationPriority();
                        this.setChange(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsScannerStorageOperations.prototype.resetPriority = function () {
        // Evaluate and set the operations priority
        this.priority = this.evaluateOperationPriority();
    };
    BoxSlotsScannerStorageOperations.prototype.updateSlots = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Refresh the response from the reader
                    return [4 /*yield*/, this.updateSlotsForReader(this.changedSlots)];
                    case 1:
                        // Refresh the response from the reader
                        _a.sent();
                        // Refresh the response from the database
                        return [4 /*yield*/, this.updateSlotsForDatabase()];
                    case 2:
                        // Refresh the response from the database
                        _a.sent();
                        // Update the state for each slot
                        return [4 /*yield*/, this.updateAllSlots()];
                    case 3:
                        // Update the state for each slot
                        _a.sent();
                        // Evaluate and set the operations proirity 
                        this.priority = this.evaluateOperationPriority();
                        return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsScannerStorageOperations.prototype.evaluateOperationPriority = function () {
        var operationPriority;
        // Based on the status of the slots set the priority of the operation
        if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.NEW; }).length > 0) {
            // Make new slots take priority
            operationPriority = slot_states_1.SlotStates.NEW;
            this.slotsStatus = "New Samples detected, press confirm to update database";
            this.canUpdateDb = true;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.MOVED; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.MOVED;
            this.slotsStatus = "Sample movement, press confirm to update database";
            this.canUpdateDb = true;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.RESERVED; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.RESERVED;
            this.slotsStatus = "Samples found in other samples slots, press confirm to update database";
            this.canUpdateDb = true;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.REMOVED; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.REMOVED;
            this.slotsStatus = "Samples from list removed, press confirm to update database";
            this.canUpdateDb = true;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.PENDING; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.PENDING;
            this.slotsStatus = "Please pick items as required";
            this.canUpdateDb = false;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.MISSING; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.MISSING;
            this.canUpdateDb = true;
            this.slotsStatus = "Samples removed, press confirm to update database";
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.UNASSIGNED; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.UNASSIGNED;
            this.slotsStatus = "Unrecognised samples in box! Please assign before storage";
            this.canUpdateDb = false;
        }
        else if (this.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.ERROR; }).length > 0) {
            operationPriority = slot_states_1.SlotStates.UNASSIGNED;
            this.slotsStatus = "ERROR! Please remove vials marked with error status";
            this.canUpdateDb = false;
        }
        else {
            // No operations to be carried out
            this.slotsStatus = "";
            this.canUpdateDb = false;
        }
        return operationPriority;
    };
    // For every item in a given list change the state of the slot to pending
    BoxSlotsScannerStorageOperations.prototype.setListItemsState = function (list) {
        var _loop_1 = function (it) {
            // If recorded as in the slot and is still in the slot
            var inSlotIndex = this_1.box.slots.findIndex(function (slot) { return (slot.getRecordedUid() === list[it].uid) && (slot.slotState === slot_states_1.SlotStates.OCCUPIED); });
            if (inSlotIndex !== -1) {
                this_1.box.slots[inSlotIndex].slotState = slot_states_1.SlotStates.PENDING;
                return "continue";
            }
            // If recorded as in the slot and is still in the slot
            var removedIndex = this_1.box.slots.findIndex(function (slot) { return (slot.getRecordedUid() === list[it].uid) && (slot.slotState === slot_states_1.SlotStates.MISSING); });
            if (removedIndex !== -1) {
                this_1.box.slots[removedIndex].slotState = slot_states_1.SlotStates.REMOVED;
            }
        };
        var this_1 = this;
        for (var it in list) {
            _loop_1(it);
        }
    };
    BoxSlotsScannerStorageOperations.prototype.getSlotsStatus = function () {
        return this.slotsStatus;
    };
    return BoxSlotsScannerStorageOperations;
}(box_slots_positional_storage_scanner_1.BoxSlotsPositionalStorageScanner));
exports.BoxSlotsScannerStorageOperations = BoxSlotsScannerStorageOperations;
//# sourceMappingURL=box-slots-scanner-storage-operations.js.map