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
var json_map_1 = require("../../../api/json-map");
var generic_storage_1 = require("../../generic-storage");
var Contents_1 = require("./Contents");
var reader_service_1 = require("../../../auth/reader-service");
var server_1 = require("../../../api/server");
var toastr = require("toastr");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var storage_bulk_scan_againest_list_1 = require("../../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list");
var ViewContents = /** @class */ (function () {
    // Constructor
    function ViewContents(storage, contents) {
        this.storage = storage;
        this.contents = contents;
    }
    // Sets up the specific bindings for contents
    ViewContents.prototype.activate = function (routeParams) {
        return __awaiter(this, void 0, void 0, function () {
            var shipmentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shipmentId = this.getShipmentId(routeParams);
                        if (!shipmentId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getOrder(shipmentId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // General properties
                        this.storage.storageType = 'contents';
                        this.storage.type_singular = "Content";
                        this.storage.type_plural = "Contents";
                        this.storage.apiPath = "Contents/" + shipmentId;
                        // Set up the table schema
                        this.storage.schema = new Map();
                        this.storage.schema.set("UID", "UID");
                        this.storage.schema.set("primary_description", "Labelled");
                        this.storage.schema.set("Batch", "Batch Name");
                        this.storage.schema.set("parent_description", "Now Stored In");
                        this.storage.schema.set("gParent_description", "Stack");
                        this.storage.schema.set("ggParent_description", "Dewar");
                        // Command presence
                        this.storage.canViewHistory = true;
                        this.storage.canDeleteItem = true;
                        // Default to true setDisplay() re-evaluates if order has been finished and sets the variable accordingly
                        this.storage.canUseReader = true;
                        // Fetch the data using the Web API
                        return [4 /*yield*/, this.storage.fetch(this.storage.apiPath + "?status=SHIPMENT", json_map_1.Server_ConvertToContents)];
                    case 3:
                        // Fetch the data using the Web API
                        _a.sent();
                        // Set the operation depending on the status of the order
                        this.setOperation();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    ViewContents.prototype.deactivate = function () {
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
    // Reset internal settings & table data
    ViewContents.prototype.reset = function () {
        this.scanOperation.reset();
        this.storage.fetch(this.storage.apiPath + "?status=SHIPMENT", json_map_1.Server_ConvertToContents);
        this.storage.subtitle = "";
    };
    // TODO remove hardcoded strings for status
    ViewContents.prototype.setOperation = function () {
        var _this = this;
        this.storage.title = this.order ? this.order.sender + " - " + this.order.recipient : "Order Unknown!";
        // If items are on the list
        if (this.storage.items && this.storage.items.length !== 0) {
            var newParentItems, requiredItems = [];
            if (this.order.status === "Awaiting-Dispatch") {
                this.storage.subtitle = "Scan items to prepare shipment";
                this.storage.selectMultiple = true;
                Contents_1.Contents.canDispatchShipment = true;
                // Set storage operation variables
                requiredItems = ["Dewar", "Canister", "Cane", "Sample", "Dry Shipper"];
                newParentItems = ["Dry Shipper"];
            }
            else if (this.order.status === "In-Transit") {
                this.storage.subtitle = "Scan items to receive shipment";
                this.storage.selectMultiple = true;
                Contents_1.Contents.canDispatchShipment = false;
                // Set required items to be read in different order
                requiredItems = ["Sample", "Cane", "Dry Shipper"];
                newParentItems = [];
            }
            else if (this.order.status === "Received") {
                this.storage.selectMultiple = false;
                this.storage.canViewHistory = true;
                this.storage.canUseReader = false;
            }
            if (this.storage.canUseReader) {
                // If connected to reader service
                reader_service_1.ReaderService.isConnected().then(function (resp) {
                    if (resp) {
                        _this.scanOperation = new storage_bulk_scan_againest_list_1.StorageBulkScanAgainestList(_this.storage, requiredItems, newParentItems);
                    }
                });
            }
        }
    };
    ViewContents.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var items, parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.scanOperation.filterSelectedItems();
                        parameter = Contents_1.Contents.canDispatchShipment ? "SEND" : "RECEIVE";
                        return [4 /*yield*/, server_1.Http_EditStorage("Shipping/" + this.order.uid + "?" + parameter, items).then(function () {
                                // TODO ADD UPDATE STATUS METHOD.
                                var message = Contents_1.Contents.canDispatchShipment ? "dispatched" : "received";
                                // Inform the user of the success
                                toastr.success("Items have been " + message);
                                _this.storage.subtitle = "Items have been " + message;
                            }).catch(function (error) {
                                // Inform the user of the error
                                toastr.error("An error occurred and the database was not successfully updated. ", error);
                            })];
                    case 1:
                        _a.sent();
                        this.scanOperation.reset();
                        // Clear selected items from list
                        this.storage.items = this.storage.items.filter(function (selectedItem) { return !selectedItem.$isSelected; });
                        if (!(this.storage.items.length === 0)) return [3 /*break*/, 3];
                        this.scanOperation.reset();
                        return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ViewContents.prototype.getShipmentId = function (routeParams) {
        // Parse the shipment id from the parameter
        if (routeParams && routeParams.item) {
            var paramParts = routeParams.item.split('%0B');
            if (paramParts.length >= 3) {
                return paramParts[1];
            }
        }
        return undefined;
    };
    ViewContents.prototype.getOrder = function (shipmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Fetch the data using the Web API 
                    return [4 /*yield*/, server_1.Http_GetItems("Orders" + "/" + shipmentId)
                            .then(function (data) {
                            var order = json_map_1.Server_ConvertToSingleOrder(data);
                            if (order) {
                                // Store the result locally
                                _this.order = order;
                            }
                            else {
                                // Undefined items list
                                toastr.error("An error occurred, the order could not be found.");
                            }
                        }).catch(function (error) {
                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        })];
                    case 1:
                        // Fetch the data using the Web API 
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Delete one or more items from the list
    ViewContents.prototype.delete = function () {
        // Hand off to the generic object
        this.storage.delete(json_map_1.Server_ConvertToContents, "?status=SHIPMENT");
    };
    ViewContents = __decorate([
        aurelia_framework_1.useView('../../generic-storage.html'),
        aurelia_dependency_injection_1.autoinject(),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, Contents_1.Contents])
    ], ViewContents);
    return ViewContents;
}());
exports.ViewContents = ViewContents;
//# sourceMappingURL=view-contents.js.map