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
var json_map_1 = require("../../api/json-map");
var generic_storage_1 = require("../generic-storage");
var containers_1 = require("./containers");
var reader_service_1 = require("../../auth/reader-service");
var Server = require("../../api/server");
var server_1 = require("../../api/server");
var toastr = require("toastr");
//! For Neck Reader
var storage_bulk_scan_againest_list_1 = require("../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list");
var aurelia_router_1 = require("aurelia-router");
var generic_storage_item_1 = require("../generic-storage-item");
var storage_type_1 = require("../storage-type");
var PrimaryContainers = /** @class */ (function () {
    // Constructor
    function PrimaryContainers(storage, containers, router) {
        this.param = "";
        this.storage = storage;
        this.containers = containers;
        this.theRouter = router;
    }
    // Sets up the specific bindings for racks
    PrimaryContainers.prototype.activate = function (routeParams) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.setDisplaySettings(routeParams);
                        // General storage properties
                        this.storage.storageType = 'container';
                        this.storage.type_singular = "Sample";
                        this.storage.type_plural = "Samples";
                        this.storage.apiPath = "PrimaryContainers";
                        this.storage.commandBtnTxt = "Audit Mode";
                        // Set up the table schema
                        this.storage.schema = new Map();
                        this.storage.schema.set("UID", "UID");
                        this.storage.schema.set("Labelled", "Labelled");
                        this.storage.schema.set("Position", "Position");
                        this.storage.schema.set("BatchName", "Batch ID");
                        // Get Material header fields for table
                        _a = this;
                        _b = json_map_1.Server_ConvertToMaterialInfo;
                        return [4 /*yield*/, server_1.Http_GetItems("MaterialInfo")];
                    case 1:
                        // Get Material header fields for table
                        _a.materialInfos = _b.apply(void 0, [_c.sent()]);
                        if (this.materialInfos) {
                            this.storage.schema.set(this.materialInfos[0].field, this.materialInfos[0].field);
                            this.storage.schema.set(this.materialInfos[1].field, this.materialInfos[1].field);
                            this.storage.schema.set(this.materialInfos[2].field, this.materialInfos[2].field);
                            this.storage.schema.set(this.materialInfos[3].field, this.materialInfos[3].field);
                        }
                        // Command presence
                        this.storage.canEditItem = true;
                        this.storage.canViewItem = true;
                        this.storage.canViewHistory = true;
                        this.storage.canAddToPickList = true;
                        this.storage.canAddBatchToPickList = true;
                        this.storage.canUpdatePickList = true;
                        this.storage.canAuditItems = false; // TODO Change here
                        return [4 /*yield*/, server_1.Http_GetItems(this.storage.apiPath + this.param)];
                    case 2:
                        data = _c.sent();
                        this.storage.items = json_map_1.Server_ConvertToPrimaryContainers(data);
                        if (containers_1.Containers.getAuditMode()) {
                            // Toggle audit mode
                            containers_1.Containers.setAuditMode(!containers_1.Containers.getAuditMode());
                            this.reset();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    PrimaryContainers.prototype.deactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!reader_service_1.ReaderService.readerOn) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stopReader()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Edit a Container (launch modal dialogue)
    PrimaryContainers.prototype.edit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storage.apiPath = "Containers";
                        // Hand off to the generic object
                        _b = (_a = this.storage).edit;
                        return [4 /*yield*/, this.getSelected(this.storage.selectedItem)];
                    case 1:
                        // Hand off to the generic object
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    // View a Container (launch modal dialogue)
    PrimaryContainers.prototype.view = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.storage.apiPath = "Containers";
                        // Hand off to the generic object
                        _b = (_a = this.storage).view;
                        return [4 /*yield*/, this.getSelected(this.storage.selectedItem)];
                    case 1:
                        // Hand off to the generic object
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    PrimaryContainers.prototype.getSelected = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetItems("Containers/" + item.uid).then(function (data) {
                            if (data) {
                                var storedItem = new generic_storage_item_1.GenericStorageItem();
                                storedItem.storageType = storage_type_1.StorageType.CONTAINER;
                                storedItem.convertTo = json_map_1.Server_ConvertToSingleGenericContainer;
                                storedItem.convertFrom = json_map_1.Server_ConvertFromGenericContainer;
                                storedItem.item = json_map_1.Server_ConvertToSingleGenericContainer(data);
                                return storedItem;
                            }
                        }).catch(function (error) {
                            console.log(error);
                        })];
                    case 1: 
                    // Get the container response record
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PrimaryContainers.prototype.startReader = function () {
        // If there are items to be read
        if (this.storage.items.length !== 0) {
            this.storage.selectMultiple = true;
            this.scanOperation = new storage_bulk_scan_againest_list_1.StorageBulkScanAgainestList(this.storage, ["Dewar"]);
        }
        else {
            this.stopReader();
            this.storage.canUseReader = false;
        }
    };
    PrimaryContainers.prototype.stopReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.scanOperation) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.scanOperation.stopReader()];
                    case 1:
                        _a.sent();
                        // Work around for no way to dispose of object
                        this.scanOperation = undefined;
                        this.storage.selectMultiple = false;
                        // Unselect items
                        this.storage.items.forEach(function (item) { return item.$isSelected = false; });
                        this.storage.subtitle = "";
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PrimaryContainers.prototype.audit = function () {
        this.reset();
    };
    PrimaryContainers.prototype.confirmAudit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var audit, selectedItems, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        audit = true;
                        selectedItems = this.storage.items.filter(function (item) { return item.$isSelected; });
                        items = [];
                        selectedItems.forEach(function (item) { return items.push(item.uid); });
                        if (items.length !== this.storage.items.length) {
                            if (!confirm((this.storage.items.length - items.length) +
                                " item(s) missing from audit. Do you wish to continue and mark these unselected items as missing?")) {
                                audit = false;
                            }
                        }
                        if (!audit) return [3 /*break*/, 2];
                        return [4 /*yield*/, Server.Http_AuditPrimaryContainers(items).then(function () {
                                toastr.success("Audit Successful");
                                //Navigate to parent route
                                _this.theRouter.navigate("containers/" + Object.keys(_this.parentContainer.ParentUidDescription)[0]);
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Reset settings
    PrimaryContainers.prototype.reset = function () {
        // Toggle audit mode
        containers_1.Containers.setAuditMode(!containers_1.Containers.getAuditMode());
        var audit = containers_1.Containers.getAuditMode();
        // Set multiple seltion to true in audit mode
        this.storage.selectMultiple = audit;
        this.storage.commandBtnTxt = audit ? "Stop Audit" : "Audit Mode";
        // Set to false when in audit mode as multiple items can be selected
        this.storage.canViewHistory = !audit;
        // Start/Stop the reader
        audit ? this.startReader() : this.stopReader();
    };
    PrimaryContainers.prototype.setDisplaySettings = function (routeParams) {
        var _this = this;
        if (routeParams.item == undefined) {
            // Set default title for main entry
            this.storage.title = "Samples";
        }
        else {
            // Set Parameter
            this.param = "/" + routeParams.item;
            // Get the containers parents
            Server.Http_GetItems("BookingOperations?UIDS=" + routeParams.item).then(function (data) {
                if (data.hasOwnProperty('Tags')) {
                    if (data.Tags.length > 0) {
                        _this.parentContainer = data.Tags[0];
                        // Set titles to parent container
                        _this.storage.title = _this.parentContainer.Description;
                        _this.storage.subtitle = _this.parentContainer.ParentUidDescription[Object.keys(_this.parentContainer.ParentUidDescription)[0]];
                    }
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    };
    PrimaryContainers = __decorate([
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, containers_1.Containers, aurelia_router_1.Router])
    ], PrimaryContainers);
    return PrimaryContainers;
}());
exports.PrimaryContainers = PrimaryContainers;
//# sourceMappingURL=primary_containers.js.map