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
var bulk_scanner_storage_operations_1 = require("../../../reader/storage-operations/bulk-scanner-storage-operations");
var reader_types_1 = require("../../../reader/reader-types");
var reader_service_1 = require("../../../auth/reader-service");
var server_1 = require("../../../api/server");
var toastr = require("toastr");
var aurelia_dialog_1 = require("aurelia-dialog");
var aurelia_framework_1 = require("aurelia-framework");
var slot_1 = require("../../../reader/data-structures/slot");
var container_states_1 = require("../../../reader/data-structures/container-states");
var material_1 = require("../../materials/material");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var Server = require("../../../api/server");
var StorageBulkDisposal = /** @class */ (function () {
    // Constructor
    function StorageBulkDisposal(dialogController) {
        this.title = "Please scan an item to begin";
        // Internal states
        this.canUpdateDb = false;
        this.containerState = container_states_1.ContainerStates.DEFAULT;
        this.controller = dialogController;
    }
    StorageBulkDisposal.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.startReader()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.unbind = function () {
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
    // Upon pressing enter
    StorageBulkDisposal.prototype.handleKeyPress = function (evt) {
        if (evt.keyCode === 13) {
            if (this.canUpdateDb) {
                this.confirm();
            }
        }
        else {
            return true;
        }
    };
    // Update database
    StorageBulkDisposal.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log(this.canUpdateDb);
                if (this.canUpdateDb) {
                    // Add to database
                    Server.Http_AddItem("Disposal", this.item).then(function (data) {
                        if (data) {
                            toastr.success(_this.item.Description + " successfully disposed.");
                        }
                        // Close the dialogue with current settings to prevent reloading and manual sections
                        _this.controller.close(true);
                    }).catch(function (error) {
                        // An error has occurred, e.g. no data
                        toastr.error(error);
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    StorageBulkDisposal.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storageOperations = new bulk_scanner_storage_operations_1.BulkScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_NR002); // TODO - Remove hardcoded dependency on neck reader and replace with some method of a selection of a bulk reader
                        return [4 /*yield*/, this.storageOperations.start()];
                    case 1:
                        _c.sent();
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.stopReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Call to stop polling the reader
                    return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        // Call to stop polling the reader
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.canUpdateDb) return [3 /*break*/, 3];
                        if (!!this.storageOperations.canUpdateDb) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validTagFound()];
                    case 1:
                        if (_a.sent()) {
                            // Change state
                            this.containerState = container_states_1.ContainerStates.FILLED;
                            this.canUpdateDb = true;
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        this.title = "Press Save to mark " + this.item.Description + " as disposed";
                        this.canUpdateDb = true;
                        this.stopReader();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.validTagFound = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readerFoundNewItems()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        if (!this.singleItemScanned()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.itemIsRecognised()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    // Ensure only one item has been scanned
    StorageBulkDisposal.prototype.singleItemScanned = function () {
        if (this.storageOperations.newTags[0].UID.length === 1) {
            return true;
        }
        else if (this.storageOperations.previousScan[0].UID.length === 0) {
            this.title = "Please present the tagged item to the Reader";
        }
        else if (this.storageOperations.previousScan[0].UID.length > 1) {
            this.title = "Please scan the items individually";
        }
        return false;
    };
    StorageBulkDisposal.prototype.readerFoundNewItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Scan the reader
                    return [4 /*yield*/, this.storageOperations.scan()];
                    case 1:
                        // Scan the reader
                        _a.sent();
                        // If a change since last read has been detected
                        if (this.storageOperations.change) {
                            this.storageOperations.setChange(false);
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.itemIsRecognised = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var recongised;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recongised = false;
                        // Query the server for the tags Identity
                        return [4 /*yield*/, server_1.Http_GetTagsIdentity(this.storageOperations.newTags).then(function (data) {
                                recongised = data.Tags[0] !== null;
                                if (!recongised) {
                                    _this.title = "Item is not in the database!";
                                    _this.containerState = container_states_1.ContainerStates.INVAILD;
                                }
                                else {
                                    _this.item = data.Tags[0];
                                }
                            }).catch(function (error) {
                                console.log(error);
                                toastr.warning(error);
                            })];
                    case 1:
                        // Query the server for the tags Identity
                        _a.sent();
                        return [2 /*return*/, recongised];
                }
            });
        });
    };
    StorageBulkDisposal.prototype.initItem = function () {
        // Set the uid
        this.item.Uid = this.storageOperations.newTags[0].UID[0];
        this.apiPath += this.item.Uid;
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", slot_1.Slot)
    ], StorageBulkDisposal.prototype, "slot", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], StorageBulkDisposal.prototype, "containerState", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", material_1.MaterialBatch)
    ], StorageBulkDisposal.prototype, "material", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageBulkDisposal.prototype, "materials", void 0);
    StorageBulkDisposal = __decorate([
        aurelia_dependency_injection_1.transient(),
        aurelia_dependency_injection_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], StorageBulkDisposal);
    return StorageBulkDisposal;
}());
exports.StorageBulkDisposal = StorageBulkDisposal;
//# sourceMappingURL=storage-bulk-disposal.js.map