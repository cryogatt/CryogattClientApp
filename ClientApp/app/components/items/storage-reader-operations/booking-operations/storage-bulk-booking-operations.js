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
var generic_storage_1 = require("../../generic-storage");
var server_1 = require("../../../api/server");
var reader_service_1 = require("../../../auth/reader-service");
var reader_types_1 = require("../../../reader/reader-types");
var bulk_scanner_storage_operations_1 = require("../../../reader/storage-operations/bulk-scanner-storage-operations");
var toastr = require("toastr");
var aurelia_dialog_1 = require("aurelia-dialog");
var container_status_dialogue_1 = require("../container-status-dialogue");
var json_map_1 = require("../../../api/json-map");
var StorageBulkBookingOperations = /** @class */ (function () {
    // Constructor
    function StorageBulkBookingOperations(storage, dialogService) {
        // Secondary storage items required to be read for storage & withdrawal 
        this.requiredItems = ["Dewar", "Canister", "Cane", "Sample"];
        this.dialogService = dialogService;
        this.storage = storage;
    }
    // Sets up the specific bindings for the table
    StorageBulkBookingOperations.prototype.bind = function () {
        // Set command properties
        //   this.storage.selectMultiple = true;
        this.storage.canUseReader = true;
        this.storage.canUpdateDb = false;
        this.storage.canViewHistory = true;
        this.storage.canStoreItems = true;
        this.storage.canWithdrawItems = true;
        this.storage.canUseResetBtn = true;
        // General storage properties
        this.storage.storageType = 'tag';
        this.storage.type_singular = "Tag";
        this.storage.type_plural = "Tags";
        this.storage.title = "Booking In/Out";
        this.storage.subtitle = "";
        this.storage.apiPath = "BookingOperations";
        // Set up the table schema
        this.storage.schema = new Map();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("Position", "Position");
        this.storage.schema.set("Description", "Description");
        this.storage.schema.set("ContainerType", "Container Type");
        this.storage.schema.set("BatchName", "Batch Name");
        // Initailise reader and start polling
        this.startReader();
    };
    // Upon leaving the page
    StorageBulkBookingOperations.prototype.deactivate = function () {
        this.stopReader();
    };
    StorageBulkBookingOperations.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storageOperations = new bulk_scanner_storage_operations_1.BulkScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_NR002);
                        return [4 /*yield*/, this.storageOperations.start()];
                    case 1:
                        _c.sent();
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkBookingOperations.prototype.stopReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Call to stop polling the reader
                    return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        // Call to stop polling the reader
                        _a.sent();
                        this.storage.canUpdateDb = this.storageOperations.canUpdateDb = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Main loop
    StorageBulkBookingOperations.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageOperations.bookingInOut(this.requiredItems)];
                    case 1:
                        _a.sent();
                        this.storage.items = this.storageOperations.foundItems;
                        this.storage.canUpdateDb = this.storageOperations.canUpdateDb;
                        this.storage.subtitle = this.storageOperations.status;
                        this.storage.subsubtitle = "No. of Samples: "
                            + this.storage.items.filter(function (x) { return x.ContainerType === "Vial"
                                || x.ContainerType == "Straw"; }).length.toString()
                            + " No. of Items scanned: " + this.storage.items.length;
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkBookingOperations.prototype.reset = function () {
        this.storageOperations.clear();
        this.storageOperations.foundItems = [];
        this.storageOperations.canUpdateDb = false;
        this.storage.title = "Booking In/Out";
        this.storage.subtitle = "";
    };
    StorageBulkBookingOperations.prototype.store = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.filterSelectedItems();
                        if (!(items !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, server_1.Http_EditStorage("BookingOperations?STORE", items).then(function () {
                                var status = "Stored";
                                var containerStatuses = json_map_1.Server_ConvertToContainerStatus(items, status);
                                server_1.Http_PostContainerStatuses(containerStatuses)
                                    .then(function (data) {
                                    // Inform the user of the success
                                    toastr.success("The items have successfully been stored.");
                                }).catch(function (error) {
                                    toastr.error("An error occurred and the database was not successfully updated.");
                                });
                            }).catch(function () {
                                // Inform the user of the error
                                toastr.error("An error occurred and the database was not successfully updated.");
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        // Inform the user no samples have been selected for storage
                        toastr.warning("No samples are selected.");
                        this.storageOperations.canUpdateDb = false;
                        _a.label = 3;
                    case 3:
                        this.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkBookingOperations.prototype.withdraw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.filterSelectedItems();
                        if (!(items !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, server_1.Http_EditStorage("BookingOperations?WITHDRAW", items).then(function () {
                                _this.SetStatus(items);
                            }).catch(function () {
                                // Inform the user of the error
                                toastr.error("An error occurred and the database was not successfully updated.");
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        // Inform the user no samples have been selected for withdrawal
                        toastr.warning("No samples are selected.");
                        this.storageOperations.canUpdateDb = false;
                        _a.label = 3;
                    case 3:
                        this.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkBookingOperations.prototype.SetStatus = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Launch a modal dialogue 
                    return [4 /*yield*/, this.dialogService.open({
                            viewModel: container_status_dialogue_1.ContainerStatusDialogue, model: items, lock: true, position: (function (modalContainer, modalOverlay) {
                            })
                        }).whenClosed(function (result) {
                            if (!result.wasCancelled) {
                                toastr.success("The items have successfully been withdrawn.");
                            }
                            else {
                                if (result.output) {
                                    // Notify the user of the error (error is passed back as the output)
                                    toastr.error(result.output);
                                }
                            }
                        }).catch(function (result) {
                            // Handle error
                            console.log(result);
                        })];
                    case 1:
                        // Launch a modal dialogue 
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkBookingOperations.prototype.filterSelectedItems = function () {
        var _this = this;
        // Filter all required items and non required items (samples) that are selected
        var selectedItems = this.storage.items.filter(function (item) { return _this.requiredItems.findIndex(function (requiredItem) { return requiredItem === item.ContainerType; }) !== -1 ||
            item.$isSelected; });
        // Return null if there are no samples in list
        return selectedItems.find(function (item) { return _this.requiredItems.findIndex(function (requiredItem) { return requiredItem === item.ContainerType; }) === -1; }) !==
            undefined
            ? selectedItems
            : null;
    };
    StorageBulkBookingOperations = __decorate([
        aurelia_framework_1.useView('../../generic-storage.html'),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, aurelia_dialog_1.DialogService])
    ], StorageBulkBookingOperations);
    return StorageBulkBookingOperations;
}());
exports.StorageBulkBookingOperations = StorageBulkBookingOperations;
//# sourceMappingURL=storage-bulk-booking-operations.js.map