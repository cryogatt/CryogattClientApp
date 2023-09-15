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
var box_positional_storage_scanner_1 = require("./box-positional-storage-scanner");
var box_states_1 = require("../../data-structures/box-states");
var toastr = require("toastr");
// Purpose of class is to scan the slots with the box and update their observed uid from the read and the slot status
var BoxSlotsPositionalStorageScanner = /** @class */ (function (_super) {
    __extends(BoxSlotsPositionalStorageScanner, _super);
    function BoxSlotsPositionalStorageScanner(readerType) {
        // Initailise the reader
        return _super.call(this, readerType) || this;
    }
    // Initial reader and internal variables
    BoxSlotsPositionalStorageScanner.prototype.initBoxSlotScanner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initBoxScanner()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Main loop to keep reading box state and maintain the slot states
    BoxSlotsPositionalStorageScanner.prototype.scanBoxSlots = function () {
        return __awaiter(this, void 0, void 0, function () {
            var boxState, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.scanBox()];
                    case 1:
                        boxState = _b.sent();
                        _a = +boxState;
                        switch (_a) {
                            case box_states_1.BoxStates.NO_BOX_SIG: return [3 /*break*/, 2];
                            case box_states_1.BoxStates.BAD_TAG_SIG: return [3 /*break*/, 3];
                            case box_states_1.BoxStates.UNKNOWN_BOX_SIG: return [3 /*break*/, 4];
                            case box_states_1.BoxStates.KNOWN_BOX_SIG: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 10];
                    case 2:
                        {
                            this.status = "Insert box on to reader";
                            return [3 /*break*/, 10];
                        }
                        _b.label = 3;
                    case 3:
                        {
                            this.status = "Invalid box";
                            toastr.error("Invalid Tag!");
                            return [3 /*break*/, 10];
                        }
                        _b.label = 4;
                    case 4:
                        {
                            this.status = "Please register box to continue";
                            return [3 /*break*/, 10];
                        }
                        _b.label = 5;
                    case 5:
                        if (!!this.storageItemFound) return [3 /*break*/, 7];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 6:
                        _b.sent();
                        console.log("Waiting for data.." + this.storageItemFound);
                        return [3 /*break*/, 5];
                    case 7:
                        if (this.storageItem && this.storageItem.hasOwnProperty('description')) {
                            this.status = this.storageItem.description + " detected";
                        }
                        // Update the observed containers for the changed slots from the reader response
                        return [4 /*yield*/, this.updateSlotsForReader(this.changedSlots)];
                    case 8:
                        // Update the observed containers for the changed slots from the reader response
                        _b.sent();
                        // Update the state for each slot
                        return [4 /*yield*/, this.updateAllSlots()];
                    case 9:
                        // Update the state for each slot
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsPositionalStorageScanner.prototype.getBoxStatus = function () {
        return this.status;
    };
    // Updates the slots when the reader output changes
    BoxSlotsPositionalStorageScanner.prototype.updateSlotsForReader = function (updatedSlots) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Set all changed slots to loading status
                    return [4 /*yield*/, this.box.setSlotsToLoading(this.changedSlots)];
                    case 1:
                        // Set all changed slots to loading status
                        _a.sent();
                        // Update the observed containers for the changed slots from the reader response
                        return [4 /*yield*/, this.box.setBoxObservedContents(this.changedSlots)];
                    case 2:
                        // Update the observed containers for the changed slots from the reader response
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Updates the slots when the database output changes
    BoxSlotsPositionalStorageScanner.prototype.updateSlotsForDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Set the recorded uids for slots from db
                    return [4 /*yield*/, this.updateBoxContents()];
                    case 1:
                        // Set the recorded uids for slots from db
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BoxSlotsPositionalStorageScanner.prototype.updateAllSlots = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.box.updateAllSlots()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BoxSlotsPositionalStorageScanner;
}(box_positional_storage_scanner_1.BoxPositionalStorageScanner));
exports.BoxSlotsPositionalStorageScanner = BoxSlotsPositionalStorageScanner;
//# sourceMappingURL=box-slots-positional-storage-scanner.js.map