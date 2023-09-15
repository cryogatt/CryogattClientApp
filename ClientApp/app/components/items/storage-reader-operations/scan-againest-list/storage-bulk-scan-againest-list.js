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
var Jsonmap = require("../../../api/json-map");
var StorageBulkScanAgainestList = /** @class */ (function () {
    // Constructor
    function StorageBulkScanAgainestList(storage, requiredItems, newParentItems) {
        this.storage = storage;
        this.requiredItems = requiredItems;
        this.newContainerParents = newParentItems;
        this.storage.canViewHistory = false;
        // Initailise reader and start polling
        this.startReader();
    }
    StorageBulkScanAgainestList.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, item, parents, parentResp, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(this.storage.items.length !== 0)) return [3 /*break*/, 7];
                        this.containerParents = [];
                        _i = 0, _a = this.storage.items;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        item = _a[_i];
                        return [4 /*yield*/, Server.Http_GetContainerParents('ContainerParent', item.uid)];
                    case 2:
                        parents = _d.sent();
                        parentResp = Jsonmap.Server_ConvertToGenericContainer(parents);
                        this.containerParents.push(parentResp);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.storageOperations = new bulk_scanner_storage_operations_1.BulkScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_NR002);
                        _c = (_b = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 5: return [4 /*yield*/, _c.apply(_b, [_d.sent()])];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        this.storage.canUseReader = false;
                        _d.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkScanAgainestList.prototype.stopReader = function () {
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
    StorageBulkScanAgainestList.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageOperations.scanAgainestList(this.storage.items, this.containerParents, this.requiredItems, this.newContainerParents)];
                    case 1:
                        _a.sent();
                        this.storage.canUpdateDb = this.storageOperations.canUpdateDb;
                        this.storage.subtitle = this.storageOperations.status;
                        // If selected item not on page navigate to it - workaround for selectedItem not set due to aurelia pagination issue
                        if (!this.storage.selectedItem && this.storage.canUpdateDb) {
                            this.storage.selectedItem = this.storage.items.find(function (item) { return item.$isSelected; });
                            setTimeout(this.storage.navigateToSelected.bind(this.storage), 100);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBulkScanAgainestList.prototype.reset = function () {
        this.storageOperations.clear();
        this.storageOperations.foundItems = [];
        this.storageOperations.canUpdateDb = false;
    };
    StorageBulkScanAgainestList.prototype.filterSelectedItems = function () {
        var _this = this;
        // Filter all required items and non required items (samples) that are selected
        var selectedItems = this.storageOperations.foundItems.filter(function (item) { return _this.requiredItems.findIndex(function (requiredItem) { return requiredItem === item.ContainerType; }) !== -1 ||
            _this.storage.items.findIndex(function (selectedItem) { return selectedItem.uid === item.Uid && selectedItem.$isSelected; }) !== -1; });
        // Return null if there are no samples in list
        return selectedItems.find(function (item) { return _this.requiredItems.findIndex(function (requiredItem) { return requiredItem === item.ContainerType; }) === -1; }) !==
            undefined
            ? selectedItems
            : null;
    };
    return StorageBulkScanAgainestList;
}());
exports.StorageBulkScanAgainestList = StorageBulkScanAgainestList;
//# sourceMappingURL=storage-bulk-scan-againest-list.js.map