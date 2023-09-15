"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoxStates;
(function (BoxStates) {
    BoxStates[BoxStates["NO_BOX_SIG"] = 0] = "NO_BOX_SIG";
    BoxStates[BoxStates["KNOWN_BOX_SIG"] = 1] = "KNOWN_BOX_SIG";
    BoxStates[BoxStates["UNKNOWN_BOX_SIG"] = 2] = "UNKNOWN_BOX_SIG";
    BoxStates[BoxStates["BAD_TAG_SIG"] = 3] = "BAD_TAG_SIG";
    BoxStates[BoxStates["BOX_CHANGED_SIG"] = 4] = "BOX_CHANGED_SIG"; // Box on reader has been swapped before reader could change state to no box
})(BoxStates = exports.BoxStates || (exports.BoxStates = {}));
;
//# sourceMappingURL=box-states.js.map