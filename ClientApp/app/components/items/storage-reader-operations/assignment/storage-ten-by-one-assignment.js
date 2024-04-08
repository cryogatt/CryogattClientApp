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
var reader_types_1 = require("../../../reader/reader-types");
var reader_service_1 = require("../../../auth/reader-service");
var server_1 = require("../../../api/server");
var aurelia_dialog_1 = require("aurelia-dialog");
var json_map_1 = require("../../../api/json-map");
var aurelia_framework_1 = require("aurelia-framework");
var Containerstates = require("../../../reader/data-structures/container-states");
var ContainerStates = Containerstates.ContainerStates;
var Positionalscannerstorageoperations = require("../../../reader/storage-operations/positional-scanner-storage-operations");
var PositionalScannerStorageOperations = Positionalscannerstorageoperations.PositionalScannerStorageOperations;
var material_1 = require("../../materials/material");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var Server = require("../../../api/server");
var toastr = require("toastr");
var tag_identity_1 = require("../../../reader/data-structures/tag-identity");
var StorageTenByOneAssignment = /** @class */ (function () {
    // Constructor
    function StorageTenByOneAssignment(dialogController) {
        this.title = "Assignment using  10x1 reader";
        this.items = [];
        // Internal states
        this.canUpdateDb = false;
        this.itemIsScanned = false;
        this.nameIsGiven = false;
        this.primaryContainer = true;
        this.loading = false;
        this.noOfSlots = 1;
        this.isInValid = true;
        // Slot binding
        this.types = ['Viability Tested', 'Safety Duplication', 'Cryobank'];
        this.descriptions = [];
        this.batches = [];
        this.controller = dialogController;
    }
    StorageTenByOneAssignment.prototype.bind = function () {
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
    StorageTenByOneAssignment.prototype.unbind = function () {
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
    StorageTenByOneAssignment.prototype.activate = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!model) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadBatches()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.primaryContainer = model.primaryContainer;
                        this.materials = model.materials;
                        this.material = model.material;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.storageOperations.newSample.size > 0)) return [3 /*break*/, 5];
                        this.CreateStoreVial();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.items.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Server.Http_AddItem(this.apiPath + '/' + this.type, this.items[i]).then(function (data) {
                                if (data) {
                                    toastr.success(" successfully added position " + _this.items[i].position);
                                }
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data
                                toastr.error(error);
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.canUpdateDb = false;
                        return [3 /*break*/, 6];
                    case 5:
                        this.controller.error("Unknown error");
                        _a.label = 6;
                    case 6:
                        // implement update db
                        this.controller.ok();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.CreateStoreVial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var slots;
            return __generator(this, function (_a) {
                slots = [];
                this.storageOperations.newSample.forEach(function (value, key) {
                    if (value !== -1) {
                        var item = _this.storageOperations.previousScan.find(function (slot) { return slot.UID[0] === key; });
                        if (item !== undefined) {
                            var description = _this.descriptions[item.antenna - 1];
                            if (description !== undefined) {
                                var data = new tag_identity_1.TagIdentity();
                                data.uid = key;
                                data.position = item.antenna;
                                data.description = _this.descriptions[item.antenna - 1];
                                data.containerType = "Vial";
                                data.batchName = _this.material.name;
                                data.tagIdent = value;
                                data.batchId = _this.material.uid;
                                slots.push(data);
                            }
                        }
                    }
                    _this.items = slots;
                });
                return [2 /*return*/];
            });
        });
    };
    //tagIdentity.uid = item.Uid;
    //tagIdentity.position = item.Position;
    //tagIdentity.description = item.Description;
    //tagIdentity.containerType = item.ContainerType;
    //tagIdentity.batchName = item.BatchName;
    //for (var antennaNo: number = 0; antennaNo < this.storageOperations.newSample.size; antennaNo++) {
    //    var slotInv: Inventory = this.storageOperations.previousScan.find(slot => slot.antenna === this.storageOperations.newSample[antennaNo]);
    //    var description = this.descriptions[item.position-1];
    //    this.items[antennaNo].description = description;
    //    this.items[antennaNo].BatchId = this.material.uid;
    //    this.items[antennaNo].InceptDate = this.items[antennaNo].InceptDate !== null ? moment(new Date()).format("MM/DD/YYYY HH:mm") : "";
    //    this.items[antennaNo].TagIdent = this.storageOperations.newSample.get(item.uid); 
    //}
    // }
    StorageTenByOneAssignment.prototype.startReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.loading = true;
                        this.storageOperations = new PositionalScannerStorageOperations(reader_types_1.ReaderType.CRYOGATT_AR101); // TODO - Remove hardcoded dependency on neck reader and replace with some method of a selection of a bulk reader
                        return [4 /*yield*/, this.storageOperations.start()];
                    case 1:
                        _c.sent();
                        _b = (_a = reader_service_1.ReaderService).startPollingReader;
                        return [4 /*yield*/, this.pollReader.bind(this)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        this.apiPath = "TenByOneBookingOperations";
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.stopReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Call to stop polling the reader
                    return [4 /*yield*/, reader_service_1.ReaderService.stopPollingReader()];
                    case 1:
                        // Call to stop polling the reader
                        _a.sent();
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    // On loop
    StorageTenByOneAssignment.prototype.pollReader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, item, deepCopy, deepCopyDescriptions, antennaNo, fdesc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.canUpdateDb) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storageOperations.assignmentTenByOne(["Vial"])];
                    case 1:
                        data = _a.sent();
                        //if (this.storageOperations.previousScan.length !== this.storageOperations.changedSlots.length) {
                        //    this.loading = false;
                        //}
                        if (this.storageOperations.canUpdateDb) {
                            this.noOfSlots = this.storageOperations.containerStates.length;
                            deepCopy = [];
                            this.batches = [];
                            deepCopyDescriptions = [];
                            for (antennaNo = 0; antennaNo < this.noOfSlots; antennaNo++) {
                                deepCopy.push(this.storageOperations.containerStates[antennaNo]);
                                item = this.storageOperations.foundItems[antennaNo];
                                if (item !== undefined) {
                                    this.batches.push(item.batchName);
                                }
                                else {
                                    this.batches.push(null);
                                }
                                fdesc = item == undefined ? "" : item.description;
                                if (fdesc.length > 0 && deepCopy[antennaNo] != ContainerStates.DEFAULT) {
                                    deepCopyDescriptions.push(fdesc);
                                }
                                else if (deepCopy[antennaNo] == ContainerStates.DEFAULT) {
                                    deepCopyDescriptions.push("");
                                }
                                else {
                                    fdesc = this.descriptions == undefined || this.descriptions[antennaNo] == undefined ? fdesc : this.descriptions[antennaNo];
                                    deepCopyDescriptions.push(fdesc);
                                }
                            }
                            // Set the array values to that found on the operation
                            this.containerStates = deepCopy;
                            this.descriptions = deepCopyDescriptions;
                            this.loading = false;
                            this.isInValid = this.CheckIsInValid();
                            this.storageOperations.canUpdateDb = false;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.loadBatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetItems("Materials").then(function (data) {
                            if (data) {
                                _this.materials = json_map_1.Server_ConvertManyToMaterialExtended(data);
                                _this.materials = _this.materials.reverse();
                            }
                        }).catch(function (error) {
                            console.log(error);
                            return false;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.initItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, item, deepCopy, deepCopydescriptions, deepCopybatches, antennaNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageOperations.assignment(["Vial"])];
                    case 1:
                        data = _a.sent();
                        this.noOfSlots = this.storageOperations.containerStates.length;
                        deepCopy = [];
                        deepCopydescriptions = [];
                        deepCopybatches = [];
                        for (antennaNo = 0; antennaNo < this.noOfSlots; antennaNo++) {
                            this.descriptions[antennaNo] = "";
                            deepCopy.push(this.storageOperations.containerStates[antennaNo]);
                            item = this.storageOperations.foundItems[antennaNo];
                            if (item !== undefined) {
                                deepCopydescriptions.push(item.description);
                                deepCopybatches.push(item.batchName);
                            }
                            else {
                                deepCopydescriptions.push('');
                                deepCopybatches.push(null);
                            }
                            // Clear the barcode if not an unfilled vial or empty slot to prevent the wrong barcode being left behind
                            if (!(this.storageOperations.containerStates[antennaNo] === ContainerStates.UNFILLED || this.storageOperations.containerStates[antennaNo] === ContainerStates.DEFAULT)) {
                                this.batches;
                            }
                        }
                        // Set the array values to that found on the operation
                        this.containerStates = deepCopy;
                        this.descriptions = deepCopydescriptions;
                        this.batches = deepCopybatches;
                        // Set the title to the status of the operation
                        //this.title = this.storageOperations.status;
                        this.canUpdateDb = this.storageOperations.canUpdateDb;
                        this.isInValid = this.CheckIsInValid();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageTenByOneAssignment.prototype.initItem_old = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var slot, antennaNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.primaryContainer) return [3 /*break*/, 5];
                        antennaNo = 0;
                        _a.label = 1;
                    case 1:
                        if (!(antennaNo < this.storageOperations.changedSlots.length)) return [3 /*break*/, 4];
                        slot = this.storageOperations.changedSlots[antennaNo];
                        if (!(this.containerStates[slot.antenna - 1] == 2)) return [3 /*break*/, 3];
                        //var tagIdentity = new tagIdentity();
                        //tagIdentity.uid = slot.Uid[0];
                        //tagIdentity.position = slot.antenna + 1;
                        //tagIdentity.description = this.descriptions[slot.antenna - 1];
                        //tagIdentity.containerType = this.type;
                        //tagIdentity.batchName = this.material;
                        // Get the record of the parent
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(slot.UID[0]).then(function (data) {
                                if (data) {
                                    data.Uid = slot.UID[0];
                                    data.Position = slot.antenna;
                                    data.Description = _this.descriptions[slot.antenna - 1];
                                    data.ContainerType = "Vial";
                                    data.BatchName = _this.material.name;
                                    _this.items.push(json_map_1.Server_ConvertToTagIdentity(data));
                                }
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 2:
                        //var tagIdentity = new tagIdentity();
                        //tagIdentity.uid = slot.Uid[0];
                        //tagIdentity.position = slot.antenna + 1;
                        //tagIdentity.description = this.descriptions[slot.antenna - 1];
                        //tagIdentity.containerType = this.type;
                        //tagIdentity.batchName = this.material;
                        // Get the record of the parent
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        antennaNo++;
                        return [3 /*break*/, 1];
                    case 4:
                        //this.apiPath = "BoxBookingOperations?STORE";
                        this.apiPath = "BookingOperations/";
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Upon pressing enter
    StorageTenByOneAssignment.prototype.handleKeyPress = function (evt) {
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        if (/^[a-zA-Z0-9\-\_ ]$/i.test(charStr)) {
            this.isInValid = this.CheckIsInValid();
            return true;
        }
        else {
            return false;
        }
    };
    StorageTenByOneAssignment.prototype.CheckIsInValid = function () {
        if (this.containerStates == undefined)
            return true;
        for (var antennaNo = 0; antennaNo < this.noOfSlots; antennaNo++) {
            if (this.containerStates[antennaNo] == 2 && this.descriptions[antennaNo].length < 3 || this.containerStates[antennaNo] > 2) {
                return true;
            }
        }
        return false;
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageTenByOneAssignment.prototype, "types", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], StorageTenByOneAssignment.prototype, "type", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageTenByOneAssignment.prototype, "containerStates", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", material_1.MaterialBatch)
    ], StorageTenByOneAssignment.prototype, "material", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageTenByOneAssignment.prototype, "materials", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageTenByOneAssignment.prototype, "descriptions", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageTenByOneAssignment.prototype, "batches", void 0);
    StorageTenByOneAssignment = __decorate([
        aurelia_dependency_injection_1.transient(),
        aurelia_dependency_injection_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], StorageTenByOneAssignment);
    return StorageTenByOneAssignment;
}());
exports.StorageTenByOneAssignment = StorageTenByOneAssignment;
//# sourceMappingURL=storage-ten-by-one-assignment.js.map