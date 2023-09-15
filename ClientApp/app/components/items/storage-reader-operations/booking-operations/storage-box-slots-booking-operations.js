"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var aurelia_templating_1 = require("aurelia-templating");
var box_slots_scanner_storage_operations_1 = require("../../../reader/storage-operations/box-slots-scanner-storage-operations");
var reader_types_1 = require("../../../reader/reader-types");
var reader_service_1 = require("../../../auth/reader-service");
var generic_box_reader_1 = require("../generic-box-reader");
var box_states_1 = require("../../../reader/data-structures/box-states");
var StorageBoxSlotsBookingOperations = /** @class */ (function () {
    function StorageBoxSlotsBookingOperations(genericBoxDisplay) {
        this.boxDisplay = genericBoxDisplay;
    }
    StorageBoxSlotsBookingOperations.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.boxDisplay.loading = true;
                        // Start the reader on startup
                        return [4 /*yield*/, this.startReader()];
                    case 1:
                        // Start the reader on startup
                        _a.sent();
                        this.boxDisplay.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    StorageBoxSlotsBookingOperations.prototype.unbind = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stopReader()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsBookingOperations.prototype.confirm = function () {
        this.boxDisplay.confirm();
    };
    StorageBoxSlotsBookingOperations.prototype.update = function () {
        this.boxDisplay.update();
    };
    StorageBoxSlotsBookingOperations.prototype.register = function () {
        this.boxDisplay.registerBox();
    };
    // Initialise reader and setup internal array
    StorageBoxSlotsBookingOperations.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storageOperations = new box_slots_scanner_storage_operations_1.BoxSlotsScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_R10101);
                        this.boxDisplay.storageOperations = this.storageOperations;
                        return [4 /*yield*/, this.storageOperations.start()];
                    case 1:
                        _c.sent();
                        this.boxDisplay.slots = [];
                        // Load box data for UI when finding storage item
                        this.storageOperations.fsm.on(box_states_1.BoxStates.KNOWN_BOX_SIG, function (from) {
                            _this.boxDisplay.loadBoxData();
                        });
                        // Load box data for UI when finding storage item
                        this.storageOperations.fsm.on(box_states_1.BoxStates.UNKNOWN_BOX_SIG, function (from) {
                            _this.boxDisplay.setDefaultParents();
                        });
                        // Make the display clear when a box is removed
                        this.storageOperations.fsm.on(box_states_1.BoxStates.NO_BOX_SIG, function (from) {
                            _this.boxDisplay.clearDisplay();
                        });
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 2: 
                    // Start polling reader
                    return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        // Start polling reader
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsBookingOperations.prototype.stopReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // On loop
    StorageBoxSlotsBookingOperations.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deepCopy, antennaNo, columnNo, row, rowNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Call the booking operation
                    return [4 /*yield*/, this.storageOperations.bookingInOut()];
                    case 1:
                        // Call the booking operation
                        _a.sent();
                        deepCopy = [];
                        antennaNo = 0;
                        // Setup array to the square root of number of antennas of the reader - means all readers/boxes have equal length of columns & rows (square) and set all states to default
                        for (columnNo = 0; columnNo < Math.sqrt(this.storageOperations.box.slots.length); columnNo++) {
                            row = [];
                            // for every row
                            for (rowNo = 0; rowNo < Math.sqrt(this.storageOperations.box.slots.length); rowNo++) {
                                if (this.storageOperations.box.slots.length > antennaNo) {
                                    row.push(this.storageOperations.box.slots[antennaNo++]);
                                }
                            }
                            deepCopy.push(row);
                        }
                        // Set the array values to that found on the operation
                        this.boxDisplay.slots = deepCopy;
                        this.boxDisplay.storageOperations = this.storageOperations;
                        // Set the title to the status of the box
                        this.boxDisplay.title = this.storageOperations.getBoxStatus();
                        // Set the subtitle to the status of the samples
                        this.boxDisplay.subtitle = this.storageOperations.getSlotsStatus();
                        // Set variable to enable button
                        this.boxDisplay.canUpdateDb = this.storageOperations.canUpdateDb;
                        // Set the priority of the storage option
                        this.boxDisplay.storageOption = this.storageOperations.priority;
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsBookingOperations = __decorate([
        aurelia_dependency_injection_1.inject(generic_box_reader_1.GenericBoxReader),
        aurelia_templating_1.useView('../generic-box-reader.html'),
        __metadata("design:paramtypes", [generic_box_reader_1.GenericBoxReader])
    ], StorageBoxSlotsBookingOperations);
    return StorageBoxSlotsBookingOperations;
}());
exports.StorageBoxSlotsBookingOperations = StorageBoxSlotsBookingOperations;
//# sourceMappingURL=storage-box-slots-booking-operations.js.map