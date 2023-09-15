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
var Orders_1 = require("./Orders");
var reader_service_1 = require("../../auth/reader-service");
var server_1 = require("../../api/server");
var Storagebulkscanshipperagainestlist = require("../storage-reader-operations/scan-againest-list/storage-bulk-scan-shipper-againest-list");
var StorageBulkScanShipperAgainestList = Storagebulkscanshipperagainestlist.StorageBulkScanShipperAgainestList;
var OrderList = /** @class */ (function () {
    // Constructor
    function OrderList(storage, orders) {
        this.stop = true;
        this.storage = storage;
        this.orders = orders;
        this.param = "";
    }
    // Sets up the specific bindings 
    OrderList.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // General storage properties
                        this.storage.storageType = 'order';
                        this.storage.type_singular = "Order";
                        this.storage.type_plural = "Orders";
                        this.storage.title = this.storage.type_plural;
                        this.storage.apiPath = "Orders";
                        // Set up the table schema
                        this.storage.schema = new Map();
                        this.storage.schema.set("UID", "UID");
                        this.storage.schema.set("consignment_no", "Consignment");
                        this.storage.schema.set("sender", "Sender");
                        this.storage.schema.set("recipient", "Recipient");
                        this.storage.schema.set("sample_qty", "Sample Qty");
                        this.storage.schema.set("status", "Status");
                        // Command bindings
                        this.storage.canCreateItem = true;
                        this.storage.canEditItem = true;
                        this.storage.canViewItem = true;
                        this.storage.canUpdatePickList = false;
                        this.storage.canDeleteItem = false;
                        this.storage.canUseReader = true;
                        this.orders.canViewInbound = true;
                        this.orders.canViewOutbound = true;
                        this.orders.canViewContents = true;
                        this.orders.canAddContentsButton = true;
                        this.storage.commandBtnTxt = "Goods In";
                        // Fetch the data using the Web API
                        _a = this.storage;
                        _b = json_map_1.Server_ConvertToOrder;
                        return [4 /*yield*/, server_1.Http_GetItems(this.storage.apiPath + this.param)];
                    case 1:
                        // Fetch the data using the Web API
                        _a.items = _b.apply(void 0, [_c.sent()]);
                        this.param = "";
                        // If connected to reader service
                        reader_service_1.ReaderService.isConnected().then(function (resp) {
                            if (resp) {
                                if (_this.storage.items && _this.storage.items.length !== 0) {
                                    // If any shippers are in transit
                                    if (_this.storage.items.some(function (order) { return order.status === "In-Transit"; })) {
                                        _this.scanOperation = new StorageBulkScanShipperAgainestList(_this.storage);
                                    }
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon leaving the page
    OrderList.prototype.unbind = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!reader_service_1.ReaderService.readerOn()) return [3 /*break*/, 2];
                        return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    OrderList.prototype.inboundFilter = function () {
        this.param = "?STATUS=INBOUND";
        this.bind();
    };
    OrderList.prototype.outboundFilter = function () {
        this.param = "?STATUS=OUTBOUND";
        this.bind();
    };
    OrderList.prototype.nonFilter = function () {
        this.param = "";
        this.bind();
    };
    OrderList.prototype.create = function () {
        // Hand off to the generic object
        this.storage.create(this.orders.getNew());
    };
    OrderList.prototype.view = function () {
        this.storage.view(this.orders.getSelected(this.storage.selectedItem));
    };
    OrderList.prototype.edit = function () {
        // Hand off to the generic object
        this.storage.edit(this.orders.getSelected(this.storage.selectedItem));
    };
    OrderList = __decorate([
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.inject(generic_storage_1.GenericStorage, Orders_1.Orders),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, Orders_1.Orders])
    ], OrderList);
    return OrderList;
}());
exports.OrderList = OrderList;
//# sourceMappingURL=order-list.js.map