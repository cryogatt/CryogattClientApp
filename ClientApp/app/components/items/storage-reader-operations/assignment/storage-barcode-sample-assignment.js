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
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_dialog_1 = require("aurelia-dialog");
var reader_service_1 = require("../../../auth/reader-service");
var Barcodesample = require("../barcode-sample");
var BarcodeSample = Barcodesample.BarcodeSample;
var Readertypes = require("../../../reader/reader-types");
var ReaderType = Readertypes.ReaderType;
var Positionalscannerstorageoperations = require("../../../reader/storage-operations/positional-scanner-storage-operations");
var PositionalScannerStorageOperations = Positionalscannerstorageoperations.PositionalScannerStorageOperations;
var Containerstates = require("../../../reader/data-structures/container-states");
var ContainerStates = Containerstates.ContainerStates;
var Server = require("../../../api/server");
var toastr = require("toastr");
var $ = require('jquery');
var StorageBarcodeSampleAssignment = /** @class */ (function () {
    // Constructor
    function StorageBarcodeSampleAssignment(dialogController) {
        // Condition for updating database
        this.canUpdateDb = false;
        this.controller = dialogController;
    }
    StorageBarcodeSampleAssignment.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Start the reader on startup
                    return [4 /*yield*/, this.startReader()];
                    case 1:
                        // Start the reader on startup
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBarcodeSampleAssignment.prototype.attached = function () {
        // Get access to user input label
        this.barcodeLbl = document.getElementById("barcodeLbl");
        this.barcodeLbl.focus();
    };
    // Update database
    StorageBarcodeSampleAssignment.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.canUpdateDb) return [3 /*break*/, 4];
                        if (!(this.storageOperations.newSample.size === 1)) return [3 /*break*/, 2];
                        // Set properties found from reader
                        this.barcodeSample.uid = Array.from(this.storageOperations.newSample.keys())[0];
                        this.barcodeSample.tagIdent = this.storageOperations.newSample.get(this.barcodeSample.uid);
                        // Add to database
                        return [4 /*yield*/, Server.Http_AddItem("BarcodeSamples", this.barcodeSample).then(function (data) {
                                if (data) {
                                    toastr.success(_this.barcodeSample.barcode + " successfully added.");
                                }
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data
                                toastr.error(error);
                            })];
                    case 1:
                        // Add to database
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.controller.error("Unknown error");
                        _a.label = 3;
                    case 3:
                        // implement update db
                        this.controller.ok();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Initialise reader and setup internal array
    StorageBarcodeSampleAssignment.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var antennaNo, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storageOperations = new PositionalScannerStorageOperations(ReaderType.CRYOGATT_SR012);
                        return [4 /*yield*/, this.storageOperations.start()];
                    case 1:
                        _c.sent();
                        // Setup array to the same size as the number of antennas and set all states to default
                        this.containerStates = [];
                        for (antennaNo = 0; antennaNo < this.storageOperations.reader.antennaQuantity; antennaNo++) {
                            this.containerStates.push(ContainerStates.DEFAULT);
                        }
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
    // On loop
    StorageBarcodeSampleAssignment.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deepCopy, antennaNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.canUpdateDb) return [3 /*break*/, 2];
                        // Call the assignment operation - TODO remove hardcoded required items paramenter
                        return [4 /*yield*/, this.storageOperations.assignment(["Vial"])];
                    case 1:
                        // Call the assignment operation - TODO remove hardcoded required items paramenter
                        _a.sent();
                        deepCopy = [];
                        for (antennaNo = 0; antennaNo < this.storageOperations.containerStates.length; antennaNo++) {
                            deepCopy.push(this.storageOperations.containerStates[antennaNo]);
                            // Clear the barcode if not an unfilled vial or empty slot to prevent the wrong barcode being left behind
                            if (!(this.storageOperations.containerStates[antennaNo] === ContainerStates.UNFILLED || this.storageOperations.containerStates[antennaNo] === ContainerStates.DEFAULT)) {
                                this.barcodeLbl.value = "";
                            }
                        }
                        // Set the array values to that found on the operation
                        this.containerStates = deepCopy;
                        // Set the title to the status of the operation
                        this.title = this.storageOperations.status;
                        this.canUpdateDb = this.storageOperations.canUpdateDb;
                        return [3 /*break*/, 3];
                    case 2:
                        if (!this.barcodeSample) {
                            this.title = "Please scan the barcode";
                        }
                        else if (this.barcodeSample.barcode) {
                            this.title = "Press confirm to continue";
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Upon pressing enter
    StorageBarcodeSampleAssignment.prototype.handleKeyPress = function (evt) {
        if (evt.keyCode === 13 && this.barcodeSample) {
            if (this.barcodeSample.hasOwnProperty('barcode') && this.barcodeSample.barcode) {
                this.confirm();
                evt.preventDefault();
            }
        }
        else {
            return true;
        }
    };
    // Input validation for the form
    StorageBarcodeSampleAssignment.prototype.validate = function () {
        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", BarcodeSample)
    ], StorageBarcodeSampleAssignment.prototype, "barcodeSample", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageBarcodeSampleAssignment.prototype, "containerStates", void 0);
    StorageBarcodeSampleAssignment = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], StorageBarcodeSampleAssignment);
    return StorageBarcodeSampleAssignment;
}());
exports.StorageBarcodeSampleAssignment = StorageBarcodeSampleAssignment;
//# sourceMappingURL=storage-barcode-sample-assignment.js.map