"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var aurelia_router_1 = require("aurelia-router");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var generic_storage_1 = require("../../generic-storage");
var box_positional_storage_scanner_1 = require("../../../reader/scanner/positional-storage-scanner/box-positional-storage-scanner");
var reader_types_1 = require("../../../reader/reader-types");
var box_states_1 = require("../../../reader/data-structures/box-states");
var reader_service_1 = require("../../../auth/reader-service");
var toastr = require("toastr");
var StorageBoxScanAgainestList = /** @class */ (function (_super) {
    __extends(StorageBoxScanAgainestList, _super);
    function StorageBoxScanAgainestList(storage, router, readerType) {
        var _this = _super.call(this, readerType) || this;
        _this.storage = storage;
        _this.theRouter = router;
        // Start the reader on startup
        _this.startReader();
        // Set initial subtitle
        _this.storage.subtitle = "Place box containing pick list items on reader to begin";
        // Setup fsm listeners
        _this.fsm.on(box_states_1.BoxStates.NO_BOX_SIG, function (from) {
            _this.storage.subtitle = "Place box containing pick list items on reader to continue";
            // Redirect back to the pick list
            _this.theRouter.navigate("picklist");
        });
        _this.fsm.on(box_states_1.BoxStates.UNKNOWN_BOX_SIG, function (from) {
            toastr.warning("Box is not in database!");
            _this.storage.subtitle = "Box is not in database!";
        });
        _this.fsm.on(box_states_1.BoxStates.BAD_TAG_SIG, function (from) {
            toastr.error("Tag not recognised!");
            _this.storage.subtitle = "Tag not recognised!";
        });
        _this.fsm.on(box_states_1.BoxStates.KNOWN_BOX_SIG, function (from) {
            _this.foundBox();
        });
        return _this;
    }
    StorageBoxScanAgainestList.inject = function () { return [aurelia_router_1.Router]; };
    // Initialise reader and setup internal array
    StorageBoxScanAgainestList.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.initBoxScanner()];
                    case 1:
                        _c.sent();
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 2: 
                    // Start polling reader
                    return [4 /*yield*/, _b.apply(_a, [_c.sent(), 10500])];
                    case 3:
                        // Start polling reader
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // On loop
    StorageBoxScanAgainestList.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Scan the reader
                    return [4 /*yield*/, this.scan()];
                    case 1:
                        // Scan the reader
                        _a.sent();
                        if (!this.change) return [3 /*break*/, 3];
                        // Scan the box 
                        return [4 /*yield*/, this.scanBox()];
                    case 2:
                        // Scan the box 
                        _a.sent();
                        this.setChange(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Action when finding a known box
    StorageBoxScanAgainestList.prototype.foundBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boxHasListItems()];
                    case 1:
                        if (_a.sent()) {
                            this.pickItems();
                        }
                        else {
                            toastr.warning(this.storageItem.description + " does not contain items on the pick list");
                            this.storage.subtitle = this.storageItem.description + " does not contain items on the pick list";
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Determine if box contains any items on the list
    StorageBoxScanAgainestList.prototype.boxHasListItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var it, cnts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.storageItemFound) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 1:
                        _a.sent();
                        console.log("Waiting for data.." + this.storageItemFound);
                        return [3 /*break*/, 0];
                    case 2:
                        // for every item on the pick list
                        for (it in this.storage.items) {
                            // for every item in the box
                            for (cnts in this.storageItemContents) {
                                // The uids match
                                if (this.storageItemContents[cnts].uid === this.storage.items[it].uid) {
                                    return [2 /*return*/, true];
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxScanAgainestList.prototype.pickItems = function () {
        toastr.success("Box containing pick list items detected");
        // Stop polling reader
        reader_service_1.ReaderService.stopPollingReader();
        // Navigate to pick items page
        this.theRouter.navigate("boxSlotsScanAgainestList");
    };
    StorageBoxScanAgainestList = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_router_1.Router),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, aurelia_router_1.Router, Number])
    ], StorageBoxScanAgainestList);
    return StorageBoxScanAgainestList;
}(box_positional_storage_scanner_1.BoxPositionalStorageScanner));
exports.StorageBoxScanAgainestList = StorageBoxScanAgainestList;
//# sourceMappingURL=storage-box-scan-againest-list.js.map