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
var aurelia_dialog_1 = require("aurelia-dialog");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var Server = require("../../../api/server");
var slot_1 = require("../../../reader/data-structures/slot");
var server_1 = require("../../../api/server");
var json_map_1 = require("../../../api/json-map");
var aurelia_templating_1 = require("aurelia-templating");
var aurelia_binding_1 = require("aurelia-binding");
var Reader = require("../../../api/reader");
var Http_GetTagIdentTypeDesc = Server.Http_GetTagIdentTypeDesc;
var Reader_Ident = Reader.Reader_Ident;
var reader_types_1 = require("../../../reader/reader-types");
var material_1 = require("../../materials/material");
var container_states_1 = require("../../../reader/data-structures/container-states");
var toastr = require("toastr");
var slot_states_1 = require("../../../reader/data-structures/slot-states");
var StorageBoxSlotsAssignment = /** @class */ (function () {
    // Constructor
    function StorageBoxSlotsAssignment(dialogController) {
        // State based on whether tag is not in db and is a vial
        this.tagIsValid = false;
        this.loading = false;
        this.types = ['Viability Tested', 'Safety Duplication', 'Cryobank'];
        this.controller = dialogController;
    }
    StorageBoxSlotsAssignment.prototype.attached = function () {
        // Get access to user input label
        this.label = document.getElementById("label");
        this.label.focus();
    };
    StorageBoxSlotsAssignment.prototype.activate = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.slot = model;
                this.init();
                return [2 /*return*/];
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loading = true;
                        this.title = "Validating tag..";
                        return [4 /*yield*/, this.validateTag()];
                    case 1:
                        if (_a.sent()) {
                            this.loadBatches();
                        }
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveVial()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.storeVial()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.updateSlot()];
                    case 3:
                        _a.sent();
                        // Notify the controller to close the window
                        this.controller.ok();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Upon pressing enter
    StorageBoxSlotsAssignment.prototype.handleKeyPress = function (evt) {
        if (evt.keyCode === 13 && this.label) {
            if (this.vial.hasOwnProperty('Description') && this.vial.Description !== '') {
                this.confirm();
                evt.preventDefault();
            }
        }
        else {
            return true;
        }
    };
    StorageBoxSlotsAssignment.prototype.saveVial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.vial.BatchId = this.material.uid;
                        return [4 /*yield*/, Server.Http_AddItem("BookingOperations" + "/" + this.type, this.vial)
                                .then(function (data) {
                                toastr.success(_this.vial.Description + " has successfully been added to the database");
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.storeVial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        // Get new record of vial
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.vial.Uid).then(function (data) {
                                if (data) {
                                    // Set the slot's observerd container
                                    _this.slot.observedContainer = json_map_1.Server_ConvertToTagIdentity(data.Tags[0]);
                                    _this.slot.setObservedUid(_this.vial.Uid);
                                    items.push(_this.slot.observedContainer);
                                }
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 1:
                        // Get new record of vial
                        _a.sent();
                        // Get the record of the parent
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.slot.storageItemUid).then(function (data) {
                                if (data) {
                                    items.push(json_map_1.Server_ConvertToTagIdentity(data.Tags[0]));
                                }
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 2:
                        // Get the record of the parent
                        _a.sent();
                        this.slot.observedContainer.position = this.slot.slotNumber;
                        return [4 /*yield*/, server_1.Http_EditStorage("BoxBookingOperations?STORE", items).then(function (data) {
                                toastr.success("Samples successfully stored");
                                // Set the recorded container for the slot
                                _this.slot.recordedContainer = _this.slot.observedContainer;
                                _this.slot.setRecordedUid(_this.slot.getObservedUid());
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.updateSlot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.slot.updateSlotState();
                return [2 /*return*/];
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.validateTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tagIsVial()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.tagNotInDb()];
                    case 2:
                        // May not be required as tag must not be in db to get to this point
                        if (_a.sent()) {
                            this.title = "Select which batch the sample belongs to and press confirm";
                            this.tagIsValid = true;
                            this.containerState = container_states_1.ContainerStates.UNFILLED;
                            return [2 /*return*/, true];
                        }
                        else {
                            this.containerState = container_states_1.ContainerStates.FILLED;
                            this.title = this.vial.description + " " + "in database!";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.title = "Item is not a Vial!";
                        this.containerState = container_states_1.ContainerStates.ERROR;
                        this.slot.slotState = slot_states_1.SlotStates.ERROR;
                        _a.label = 4;
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.tagIsVial = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isVial, tagIdentResp, tagType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isVial = false;
                        return [4 /*yield*/, Reader_Ident(String(reader_types_1.ReaderType.CRYOGATT_R10101), this.slot.getObservedUid(), this.slot.slotNumber)
                                .catch(function (error) {
                                console.log(error);
                                return false;
                            })];
                    case 1:
                        tagIdentResp = _a.sent();
                        if (!tagIdentResp.hasOwnProperty('Ident')) return [3 /*break*/, 3];
                        // Is Ident set
                        if (tagIdentResp.Ident === "00000000") {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, Http_GetTagIdentTypeDesc(tagIdentResp.Ident).catch(function (error) {
                                console.log(error);
                                return false;
                            })];
                    case 2:
                        tagType = _a.sent();
                        // Add these propperties to data structure immediatley after being read incase removed
                        this.vial = {
                            Uid: this.slot.getObservedUid(),
                            TagIdent: parseInt(tagIdentResp.Ident, 16),
                        };
                        isVial = tagType === "Vial";
                        _a.label = 3;
                    case 3: return [2 /*return*/, isVial];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.tagNotInDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vial;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.slot.getObservedUid()).catch(function (error) {
                            console.log(error);
                            return false;
                        })];
                    case 1:
                        vial = _a.sent();
                        // Valid response
                        if (vial.hasOwnProperty('Tags')) {
                            // Valid tag
                            if (vial.Tags[0] === null) {
                                return [2 /*return*/, true];
                            }
                            else {
                                this.vial = json_map_1.Server_ConvertToTagIdentity(vial.Tags[0]);
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    StorageBoxSlotsAssignment.prototype.loadBatches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Server.Http_GetItems("Materials").then(function (data) {
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
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", slot_1.Slot)
    ], StorageBoxSlotsAssignment.prototype, "slot", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageBoxSlotsAssignment.prototype, "types", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], StorageBoxSlotsAssignment.prototype, "type", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], StorageBoxSlotsAssignment.prototype, "containerState", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", material_1.MaterialBatch)
    ], StorageBoxSlotsAssignment.prototype, "material", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], StorageBoxSlotsAssignment.prototype, "materials", void 0);
    StorageBoxSlotsAssignment = __decorate([
        aurelia_dependency_injection_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], StorageBoxSlotsAssignment);
    return StorageBoxSlotsAssignment;
}());
exports.StorageBoxSlotsAssignment = StorageBoxSlotsAssignment;
//# sourceMappingURL=storage-box-slots-assignment.js.map