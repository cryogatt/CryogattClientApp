"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlotStates;
(function (SlotStates) {
    SlotStates[SlotStates["EMPTY"] = 0] = "EMPTY";
    SlotStates[SlotStates["OCCUPIED"] = 1] = "OCCUPIED";
    SlotStates[SlotStates["MISSING"] = 2] = "MISSING";
    SlotStates[SlotStates["REMOVED"] = 3] = "REMOVED";
    SlotStates[SlotStates["RESERVED"] = 4] = "RESERVED";
    SlotStates[SlotStates["NEW"] = 5] = "NEW";
    SlotStates[SlotStates["MOVED"] = 6] = "MOVED";
    SlotStates[SlotStates["PENDING"] = 7] = "PENDING";
    SlotStates[SlotStates["ERROR"] = 8] = "ERROR";
    SlotStates[SlotStates["STORAGE_TAG"] = 9] = "STORAGE_TAG";
    SlotStates[SlotStates["LOADING"] = 10] = "LOADING";
    SlotStates[SlotStates["UNASSIGNED"] = 11] = "UNASSIGNED"; // Unrecognised container in slot
})(SlotStates = exports.SlotStates || (exports.SlotStates = {}));
//# sourceMappingURL=slot-states.js.map