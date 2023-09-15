"use strict";
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
var reader_service_1 = require("../../../auth/reader-service");
var reader_types_1 = require("../../../reader/reader-types");
var bulk_scanner_storage_operations_1 = require("../../../reader/storage-operations/bulk-scanner-storage-operations");
var Server = require("../../../api/server");
var toastr = require("toastr");
var StorageBulkScanShipperAgainestList = /** @class */ (function () {
    // Constructor
    function StorageBulkScanShipperAgainestList(storage) {
        this.storage = storage;
        // Initailise reader and start polling
        this.startReader();
    }
    StorageBulkScanShipperAgainestList.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.storage.items.length !== 0)) return [3 /*break*/, 2];
                        this.storageOperations = new bulk_scanner_storage_operations_1.BulkScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_NR002);
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        this.storage.subtitle = "Scan an incoming shipper to recieve shipment";
                        return [3 /*break*/, 3];
                    case 2:
                        this.storage.canUseReader = false;
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Main loop
    StorageBulkScanShipperAgainestList.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.storage.canUpdateDb) return [3 /*break*/, 5];
                        // Poll reader
                        return [4 /*yield*/, this.storageOperations.scanForKnownItems()];
                    case 1:
                        // Poll reader
                        _a.sent();
                        if (!this.storageOperations.canUpdateDb) return [3 /*break*/, 5];
                        if (!(this.storageOperations.foundItems.length === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getCourier(this.storageOperations.foundItems[0].Uid)];
                    case 2:
                        item = _a.sent();
                        if (item) {
                            order = this.getShippersOrder(item);
                            if (order) {
                                this.storage.subtitle = "Order " + order.consignment_no + " courier arrived: " + item.ShipperName;
                                this.storage.canUpdateDb = true;
                                // If selected item not on page navigate to it - workaround for selectedItem not set due to aurelia pagination issue
                                if (!this.storage.selectedItem) {
                                    this.storage.selectedItem = this.storage.items.find(function (item) { return item.$isSelected; });
                                    setTimeout(this.storage.navigateToSelected.bind(this.storage), 100);
                                }
                            }
                        }
                        else {
                            this.storage.subtitle = "Item is not registered to any pending orders!";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.storage.subtitle = "More than one item detected!";
                        _a.label = 4;
                    case 4:
                        this.reset();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Get the courier record that the tag belongs to
    StorageBulkScanShipperAgainestList.prototype.getCourier = function (shipperUid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Server.Http_GetItems("Shipping" + "/" + shipperUid).then(function (data) {
                        if (data && data.hasOwnProperty('Couriers')) {
                            if (data.Couriers.length === 1) {
                                return data.Couriers[0];
                            }
                            else if (data.Couriers.length === 0) {
                                return null;
                            }
                            else if (data.Couriers.length > 1) {
                                toastr.error("Shipper belongs to more than one shipment!");
                            }
                            return data;
                        }
                        else {
                            return null;
                        }
                    }).catch(function (error) {
                        toastr.error(error);
                    })];
            });
        });
    };
    // Get the order that the shipper belongs to
    StorageBulkScanShipperAgainestList.prototype.getShippersOrder = function (item) {
        var order = this.storage.items.find(function (order) { return order.uid === item.ShipmentId; });
        if (order) {
            order.$isSelected = true;
        }
        return order;
    };
    StorageBulkScanShipperAgainestList.prototype.reset = function () {
        this.storageOperations.clear();
        this.storageOperations.foundItems = [];
        this.storageOperations.canUpdateDb = false;
    };
    return StorageBulkScanShipperAgainestList;
}());
exports.StorageBulkScanShipperAgainestList = StorageBulkScanShipperAgainestList;
//# sourceMappingURL=storage-bulk-scan-shipper-againest-list.js.map