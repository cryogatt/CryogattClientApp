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
var aurelia_router_1 = require("aurelia-router");
var toastr = require("toastr");
var reader_service_1 = require("../../auth/reader-service");
var server_1 = require("../../api/server");
var Server = require("../../api/server");
//! For Neck Reader
var storage_bulk_scan_againest_list_1 = require("../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list");
var ContainerList = /** @class */ (function () {
    // Constructor
    function ContainerList(storage, containers, router) {
        // Parameters for URL
        this.param = "";
        // Top level containers
        this.home = false;
        this.storage = storage;
        this.containers = containers;
        this.theRouter = router;
    }
    ContainerList.inject = function () { return [aurelia_router_1.Router]; };
    // Sets up the specific bindings for ContainerList
    ContainerList.prototype.activate = function (routeParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // General storage properties
                        this.storage.apiPath = "Containers";
                        this.storage.storageType = 'container';
                        this.storage.type_singular = "Storage"; //TODO Sort propper names for this. Maybe types read out of database?
                        this.storage.type_plural = "ContainerList";
                        // Sets the internal & display settings depending on the level of containers 
                        this.setLevelSettings(routeParams);
                        // Set up the table schema
                        this.storage.schema = new Map();
                        this.storage.schema.set("UID", "UID");
                        this.storage.schema.set("name", "Name");
                        this.storage.schema.set("type", "Type");
                        this.storage.schema.set("addedDate", "Added");
                        this.storage.schema.set("containsQty", "Contains Qtty");
                        this.storage.schema.set("containsType", "Contains Type");
                        // Set up container properties
                        this.containers.containsTypeSingular = "Container";
                        this.containers.containsTypePlural = "Containers";
                        // Command presence
                        this.storage.canCreateItem = true; // TODO Change here
                        this.storage.createItemInfo = "Create Non RFID Enabled Containers such as Freezers, etc";
                        this.storage.canAuditItems = false; // TODO Change here
                        this.storage.canEditItem = true;
                        this.storage.canViewItem = true;
                        this.storage.canViewHistory = true;
                        this.containers.canAddContents = true;
                        this.containers.canViewContents = true;
                        this.containers.canViewAliquots = true;
                        this.storage.canViewHistory = true;
                        this.storage.commandBtnTxt = "Audit Mode";
                        return [4 /*yield*/, this.storage.fetch(this.storage.apiPath + "/" + this.param, json_map_1.Server_ConvertToGenericContainer)];
                    case 1:
                        _a.sent();
                        if (containers_1.Containers.getAuditMode()) {
                            // Toggle audit mode
                            containers_1.Containers.setAuditMode(!containers_1.Containers.getAuditMode());
                            this.reset();
                        }
                        // Clear the Parameter
                        this.param = "";
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    ContainerList.prototype.deactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!reader_service_1.ReaderService.readerOn()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stopReader()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Create a new Container (launch modal dialogue)
    ContainerList.prototype.create = function () {
        this.storage.apiPath = "NonRFIDEnabledContainers";
        // Hand off to the generic object
        this.storage.create(this.containers.getNew());
    };
    // Edit a Container (launch modal dialogue)
    ContainerList.prototype.edit = function () {
        this.storage.apiPath = "Containers";
        // Hand off to the generic object
        this.storage.edit(this.containers.getSelected(this.storage.selectedItem));
    };
    // View a Container (launch modal dialogue)
    ContainerList.prototype.view = function () {
        this.storage.apiPath = "Containers";
        // Hand off to the generic object
        this.storage.view(this.containers.getSelected(this.storage.selectedItem));
    };
    // Start/Stop audit mode
    ContainerList.prototype.audit = function () {
        this.reset();
    };
    // Sets the internal & display settings depending on the level of containers 
    ContainerList.prototype.setLevelSettings = function (routeParams) {
        var _this = this;
        // Undefined for top level
        if (routeParams.item == undefined) {
            this.home = true;
            // Set default title for main entry
            this.storage.title = "Storage Records";
            containers_1.Containers.setAuditMode(false);
        }
        else {
            this.home = false;
            // Set Parameter
            this.param = "?UIDS=" + routeParams.item;
            // Get the containers parents
            Server.Http_GetItems("BookingOperations" + this.param).then(function (data) {
                if (data.hasOwnProperty('Tags')) {
                    if (data.Tags.length > 0) {
                        _this.parentContainer = data.Tags[0];
                        // Set titles to parent container
                        _this.storage.title = _this.parentContainer.Description;
                        _this.storage.subtitle = _this.parentContainer.ParentUidDescription[Object.keys(_this.parentContainer.ParentUidDescription)[0]];
                    }
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
    };
    // Determines which route to take depending on the containers being primary or secondary
    ContainerList.prototype.viewContents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetContainerContentsLevel(this.storage.selectedItem.uid).catch(function (error) {
                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        })];
                    case 1:
                        resp = _a.sent();
                        if (resp) {
                            if (resp === 2) {
                                // Navigate to primary samples page
                                this.theRouter.navigate("samples/" + this.storage.selectedItem.uid);
                            }
                            else {
                                // Navigate to next level
                                this.theRouter.navigate("containers/" + this.storage.selectedItem.uid);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Confirmation of audit
    ContainerList.prototype.confirmAudit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Update db
                    return [4 /*yield*/, server_1.Http_AuditItem(this.storage.selectedItem.uid)
                            .then(function () {
                            toastr.success(_this.storage.selectedItem.name + " successfully audited.");
                        }).catch(function (error) {
                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        })];
                    case 1:
                        // Update db
                        _a.sent();
                        if (this.storage.selectedItem.containsQty !== 0) {
                            // Navigate to child containers
                            this.viewContents();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Start/Stop the audit mode
    ContainerList.prototype.reset = function () {
        // Toggle audit mode
        containers_1.Containers.setAuditMode(!containers_1.Containers.getAuditMode());
        var audit = containers_1.Containers.getAuditMode();
        // Set to false when in audit mode as multiple items can be selected
        this.storage.canViewHistory = !audit;
        this.storage.commandBtnTxt = audit ? "Stop Audit" : "Audit Mode";
        // Start/Stop the reader
        audit ? this.startReader() : this.stopReader();
    };
    ContainerList.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // If there are items to be read
                if (this.storage.items.length !== 0) {
                    this.scanOperation = new storage_bulk_scan_againest_list_1.StorageBulkScanAgainestList(this.storage, ["Dewar"]);
                }
                else {
                    this.stopReader();
                    this.storage.canUseReader = false;
                }
                return [2 /*return*/];
            });
        });
    };
    ContainerList.prototype.stopReader = function () {
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
                        _a.label = 2;
                    case 2:
                        // Unselect items
                        this.storage.items.forEach(function (item) { return item.$isSelected = false; });
                        return [2 /*return*/];
                }
            });
        });
    };
    ContainerList = __decorate([
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.inject(generic_storage_1.GenericStorage, containers_1.Containers, aurelia_router_1.Router),
        __metadata("design:paramtypes", [Object, Object, aurelia_router_1.Router])
    ], ContainerList);
    return ContainerList;
}());
exports.ContainerList = ContainerList;
//# sourceMappingURL=container-list.js.map