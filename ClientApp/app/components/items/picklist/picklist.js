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
var aurelia_router_1 = require("aurelia-router");
var generic_storage_1 = require("../generic-storage");
var json_map_1 = require("../../api/json-map");
var reader_service_1 = require("../../auth/reader-service");
var server_1 = require("../../api/server");
var Server = require("../../api/server");
var toastr = require("toastr");
//! For 10x10
var storage_box_scan_againest_list_1 = require("../storage-reader-operations/scan-againest-list/storage-box-scan-againest-list");
var aurelia_dialog_1 = require("aurelia-dialog");
var container_status_dialogue_1 = require("../storage-reader-operations/container-status-dialogue");
var reader_types_1 = require("../../reader/reader-types");
var PickList = /** @class */ (function () {
    // Constructor
    function PickList(storage, router, dialogService) {
        this.storage = storage;
        this.theRouter = router;
        this.dialogService = dialogService;
    }
    // Sets up the specific bindings for Pick List
    PickList.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Command bindings
                        this.storage.canDeleteFromPickList = true;
                        this.storage.canUpdatePickList = true;
                        this.storage.canUseReader = true;
                        this.storage.canUpdateDb = false;
                        this.storage.canStoreItems = false;
                        this.storage.canWithdrawItems = false;
                        this.storage.canViewHistory = true;
                        // General storage properties
                        this.storage.type_singular = "Pick List";
                        this.storage.type_plural = "Pick List";
                        this.storage.title = "Pick List";
                        this.storage.apiPath = "picklist";
                        // Set up the table schema
                        this.storage.schema = new Map();
                        this.storage.schema.set("UID", "UID");
                        this.storage.schema.set("BatchName", "Batch");
                        this.storage.schema.set("primary_description", "Labelled");
                        this.storage.schema.set("position", "Position");
                        this.storage.schema.set("parent_description", "Stored in");
                        this.storage.schema.set("gParent_description", "..");
                        this.storage.schema.set("ggParent_description", "...");
                        // Set table data
                        _a = this.storage;
                        _b = json_map_1.Server_ConvertToPicklist;
                        return [4 /*yield*/, server_1.Http_GetItems(this.storage.apiPath)];
                    case 1:
                        // Set table data
                        _a.items = _b.apply(void 0, [_c.sent()]);
                        // If connected to reader service
                        reader_service_1.ReaderService.isConnected().then(function (resp) {
                            if (resp) {
                                // If items are on the pick list scan scanner
                                if (_this.storage.items && _this.storage.items.length !== 0) {
                                    _this.storage.selectMultiple = true;
                                    //     this.scanOperation = new StorageColdBoxScanAgainestList(this.storage, this.theRouter);
                                    _this.scanOperation = new storage_box_scan_againest_list_1.StorageBoxScanAgainestList(_this.storage, _this.theRouter, reader_types_1.ReaderType.CRYOGATT_R10101); //! For 10x10
                                    //   this.scanOperation = new StorageBulkScanAgainestList(this.storage, ["Dewar", "Canister", "Cane", "Sample"]); 
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    PickList.prototype.deactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!reader_service_1.ReaderService.readerOn) return [3 /*break*/, 2];
                        return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PickList.prototype.reset = function () {
        var _this = this;
        this.scanOperation.reset();
        server_1.Http_GetItems(this.storage.apiPath)
            .then(function (data) {
            var items = json_map_1.Server_ConvertToPicklist(data);
            if (items) {
                // Store the result locally
                _this.storage.items = items;
            }
            else {
                // Undefined items list
                toastr.error("An error occurred, and no records can be displayed.");
                _this.storage.items = [];
            }
        }).catch(function (error) {
            // An error has occurred, e.g. no data
            toastr.error(error);
        });
    };
    PickList.prototype.withdraw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.scanOperation.filterSelectedItems();
                        if (!(items !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Server.Http_EditStorage("BookingOperations?WITHDRAW", items).then(function () {
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
                        this.scanOperation.storageOperations.canUpdateDb = false;
                        _a.label = 3;
                    case 3:
                        // Refresh list
                        this.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    PickList.prototype.SetStatus = function (items) {
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
    PickList = __decorate([
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, aurelia_router_1.Router, aurelia_dialog_1.DialogService])
    ], PickList);
    return PickList;
}());
exports.PickList = PickList;
//# sourceMappingURL=picklist.js.map