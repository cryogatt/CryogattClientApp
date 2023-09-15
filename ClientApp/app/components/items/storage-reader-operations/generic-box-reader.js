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
var toastr = require("toastr");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var slot_states_1 = require("../../reader/data-structures/slot-states");
var aurelia_templating_1 = require("aurelia-templating");
var aurelia_binding_1 = require("aurelia-binding");
var server_1 = require("../../api/server");
var json_map_1 = require("../../api/json-map");
var container_1 = require("../containers/container");
var GenericBoxReader = /** @class */ (function () {
    function GenericBoxReader() {
        this.title = "Place box on reader to begin";
        // boolean set to true when db has been updated
        this.updated = false;
        // Database is being updated
        this.loading = false;
        // Interal variable for items that are two levels of storage deep
        this.usingSecondDropMenu = false;
        this.batteryLife = 0;
        this.canViewTemperatureStats = false;
        this.canUpdateDb = false;
    }
    // Retrieve possible parents for the box to be stored in
    GenericBoxReader.prototype.loadBoxData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loading = true;
                        _a.label = 1;
                    case 1:
                        if (!!this.storageOperations.storageItemFound) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 2:
                        _a.sent();
                        console.log("Waiting for data..");
                        return [3 /*break*/, 1];
                    case 3:
                        this.setParentOptions();
                        // Set label 
                        if (this.storageOperations.storageItem && this.storageOperations.storageItem.hasOwnProperty('description')) {
                            this.boxName = this.storageOperations.storageItem.description;
                        }
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    GenericBoxReader.prototype.setParentOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getParents()];
                    case 1:
                        _a.gParents = _b.sent();
                        if (this.storageOperations.storageItem.parentUidDescription.size > 0) {
                            this.currentParentUid = this.storageOperations.storageItem.parentUidDescription.keys().next().value;
                            this.gParentChangedEvent(this.currentParentUid);
                        }
                        else {
                            this.currentParentUid = "Not stored";
                            this.setDefaultParents();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Dropdown option changed
    GenericBoxReader.prototype.gParentChangedEvent = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var record, selectedItem, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(uid).catch(function (error) { toastr.error(error); })];
                    case 1:
                        record = _d.sent();
                        selectedItem = json_map_1.Server_ConvertToTagIdentity(record.Tags[0]);
                        if (!(selectedItem.containerType === "Dewar")) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.getParents(uid)];
                    case 2:
                        _a.parents = _d.sent();
                        this.usingSecondDropMenu = true;
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(selectedItem.containerType === "Stack")) return [3 /*break*/, 5];
                        _b = this;
                        return [4 /*yield*/, this.getParents(selectedItem.parentUidDescription.keys().next().value)];
                    case 4:
                        _b.parents = _d.sent();
                        this.parent = this.parent = this.parents.find(function (cont) { return cont.uid === selectedItem.uid; });
                        this.gParent = this.gParents.find(function (cont) { return cont.uid === selectedItem.parentUidDescription.keys().next().value; });
                        this.usingSecondDropMenu = true;
                        return [3 /*break*/, 7];
                    case 5:
                        this.usingSecondDropMenu = false;
                        _c = this;
                        return [4 /*yield*/, this.getParents()];
                    case 6:
                        _c.parents = _d.sent();
                        this.parent = this.parents.find(function (cont) { return cont.uid === selectedItem.uid; });
                        _d.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Dropdown option changed
    GenericBoxReader.prototype.parentChangedEvent = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var record, selectedItem_1, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.usingSecondDropMenu) return [3 /*break*/, 5];
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(uid).catch(function (error) { toastr.error(error); })];
                    case 1:
                        record = _c.sent();
                        selectedItem_1 = json_map_1.Server_ConvertToTagIdentity(record.Tags[0]);
                        if (!(selectedItem_1.containerType === "Dewar")) return [3 /*break*/, 5];
                        if (!!this.gParents) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.getParents()];
                    case 2:
                        _a.gParents = _c.sent();
                        _c.label = 3;
                    case 3:
                        this.gParent = this.gParents.find(function (cont) { return cont.uid === selectedItem_1.uid; });
                        this.parent = undefined;
                        _b = this;
                        return [4 /*yield*/, this.getParents(uid)];
                    case 4:
                        _b.parents = _c.sent();
                        this.usingSecondDropMenu = true;
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GenericBoxReader.prototype.getParents = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!uid) return [3 /*break*/, 2];
                        return [4 /*yield*/, server_1.Http_GetItems('Containers?UIDS=' + uid).then(function (data) {
                                if (data) {
                                    return json_map_1.Server_ConvertToGenericContainer(data);
                                }
                            }).catch(function (error) { toastr.error(error); })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, server_1.Http_GetItems('Containers').then(function (data) {
                            if (data) {
                                return json_map_1.Server_ConvertToGenericContainer(data);
                            }
                        }).catch(function (error) { toastr.error(error); })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GenericBoxReader.prototype.setDefaultParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!this.parents || this.parents.length === 0)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getParents()];
                    case 1:
                        _a.parents = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Used to change the location of the box
    GenericBoxReader.prototype.update = function () {
        if (this.parent) {
            // Location changed
            if (this.currentParentUid !== this.parent.uid) {
                this.restoreBox();
            }
            // Name changed
            if (this.storageOperations.storageItem.description !== this.boxName) {
                this.editName();
            }
        }
        else {
            toastr.warning("No option selected!");
        }
    };
    // Put box into database and store it
    GenericBoxReader.prototype.registerBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.boxName) return [3 /*break*/, 4];
                        // Set the name from the user input
                        this.storageOperations.storageItem.Description = this.boxName;
                        if (!this.parent) return [3 /*break*/, 2];
                        // Post the data using the Web API
                        return [4 /*yield*/, server_1.Http_AddItem('Containers' + "/" + this.parent.uid, this.storageOperations.storageItem)
                                .then(function (data) {
                                toastr.success(data.Description + " has successfully been added to the database");
                            }).catch(function (error) {
                                // An error has occurred, e.g. no data, or invalid field values
                                toastr.error(error);
                            })];
                    case 1:
                        // Post the data using the Web API
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        toastr.warning("No option selected!");
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        toastr.warning("Please enter the boxes name");
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Change the location of where the box is stored
    GenericBoxReader.prototype.restoreBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var rec, selectedItem, items, pRec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.parent.uid).catch(function (error) { toastr.error(error); })];
                    case 1:
                        rec = _a.sent();
                        selectedItem = rec.Tags[0];
                        if (!(selectedItem && selectedItem.description !== this.currentParentUid)) return [3 /*break*/, 6];
                        items = void 0;
                        if (!this.usingSecondDropMenu) return [3 /*break*/, 3];
                        return [4 /*yield*/, server_1.Http_GetSingleTagIdentity(this.gParent.uid).catch(function (error) { toastr.error(error); })];
                    case 2:
                        pRec = _a.sent();
                        items = [selectedItem, this.storageOperations.storageItem, pRec.Tags[0]];
                        return [3 /*break*/, 4];
                    case 3:
                        items = [selectedItem, this.storageOperations.storageItem];
                        _a.label = 4;
                    case 4: return [4 /*yield*/, server_1.Http_EditStorage("BookingOperations?STORE", items).then(function (data) {
                            toastr.success("Box is now stored in " + _this.parent.name);
                            // Update current name for reference
                            _this.currentParentUid = _this.parent.uid;
                        }).catch(function (error) {
                            toastr.warning(error);
                        })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        toastr.warn(this.parent + " not recognised!");
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GenericBoxReader.prototype.editName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var containerRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, server_1.Http_GetItems('Containers/' + this.storageOperations.storageItem.uid).catch(function (error) {
                            console.error(error);
                        })];
                    case 1:
                        containerRecord = _a.sent();
                        if (!containerRecord) return [3 /*break*/, 3];
                        // Set the new name
                        containerRecord.Description = this.boxName;
                        // Update db
                        return [4 /*yield*/, server_1.Http_EditStorage('Containers/' + this.storageOperations.storageItem.uid, containerRecord).then(function (data) {
                                toastr.success("Box name has been changed");
                                // Update the internal record
                                _this.storageOperations.storageItem.description = _this.boxName;
                            })];
                    case 2:
                        // Update db
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GenericBoxReader.prototype.clearDisplay = function () {
        this.boxName = '';
        this.parents = [];
        this.parent = undefined;
    };
    // Handle to button for user to confirm operation
    GenericBoxReader.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.canUpdateDb && !this.loading)) return [3 /*break*/, 12];
                        // Start loading symbol
                        this.loading = true;
                        _a = this.storageOption;
                        switch (_a) {
                            case (slot_states_1.SlotStates.NEW): return [3 /*break*/, 1];
                            case (slot_states_1.SlotStates.MISSING): return [3 /*break*/, 3];
                            case (slot_states_1.SlotStates.REMOVED): return [3 /*break*/, 5];
                            case (slot_states_1.SlotStates.MOVED): return [3 /*break*/, 7];
                            case (slot_states_1.SlotStates.RESERVED): return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this.bookNewSamples()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 3: return [4 /*yield*/, this.bookOutMissingSamples()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 5: return [4 /*yield*/, this.bookOutRemovedSamples()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 7: // Server checks on both states if the slot is reserved
                    return [4 /*yield*/, this.bookSampleMovement()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9: // Server checks on both states if the slot is reserved
                    return [4 /*yield*/, this.bookSampleMovement()];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        this.loading = false;
                        _b.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // Used for being assigned samples into storage
    GenericBoxReader.prototype.bookNewSamples = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, newStoredContainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        newStoredContainers = this.storageOperations.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.NEW; });
                        newStoredContainers.forEach(function (slot) { return slot.observedContainer.position = slot.slotNumber; });
                        // Add to list
                        newStoredContainers.forEach(function (slot) { return items.push(slot.observedContainer); });
                        // Add the associated parents
                        items.push(this.storageOperations.storageItem);
                        return [4 /*yield*/, server_1.Http_EditStorage("BoxBookingOperations?STORE", items).then(function (data) {
                                toastr.success("Samples successfully stored");
                            }).catch(function (error) {
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        // Refresh slots for database change
                        return [4 /*yield*/, this.storageOperations.updateSlots()];
                    case 2:
                        // Refresh slots for database change
                        _a.sent();
                        this.updated = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Used for booking out samples out of storage
    GenericBoxReader.prototype.bookOutMissingSamples = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, withdrawnContainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        withdrawnContainers = this.storageOperations.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.MISSING; });
                        // Add the recorded containers to list
                        withdrawnContainers.forEach(function (slot) { return items.push(slot.recordedContainer); });
                        // Add the associated parents
                        items.push(this.storageOperations.storageItem);
                        return [4 /*yield*/, server_1.Http_EditStorage("BoxBookingOperations?WITHDRAW", items).then(function (data) {
                                toastr.success("Samples successfully withdrawn");
                            }).catch(function (error) {
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        // Refresh slots for database change
                        return [4 /*yield*/, this.storageOperations.updateSlots()];
                    case 2:
                        // Refresh slots for database change
                        _a.sent();
                        this.updated = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Used for booking out samples out of storage
    GenericBoxReader.prototype.bookOutRemovedSamples = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, withdrawnContainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        withdrawnContainers = this.storageOperations.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.REMOVED; });
                        // Add the recorded containers to list
                        withdrawnContainers.forEach(function (slot) { return items.push(slot.recordedContainer); });
                        // Add the associated parents
                        items.push(this.storageOperations.storageItem);
                        return [4 /*yield*/, server_1.Http_EditStorage("BoxBookingOperations?WITHDRAW", items).then(function (data) {
                                toastr.success("Samples successfully withdrawn");
                            }).catch(function (error) {
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        // Refresh slots for database change
                        return [4 /*yield*/, this.storageOperations.updateSlots()];
                    case 2:
                        // Refresh slots for database change
                        _a.sent();
                        this.updated = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    // Used for booking the movement of samples between slots
    GenericBoxReader.prototype.bookSampleMovement = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, movedContainers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        movedContainers = this.storageOperations.box.slots.filter(function (slot) { return slot.slotState === slot_states_1.SlotStates.MOVED || slot.slotState === slot_states_1.SlotStates.RESERVED; });
                        // Set the slots observed containers to thier new slot positions
                        movedContainers.forEach(function (slot) { return slot.observedContainer.position = slot.slotNumber; });
                        // Add the observered containers to list
                        movedContainers.forEach(function (slot) { return items.push(slot.observedContainer); });
                        // Add the associated parents
                        items.push(this.storageOperations.storageItem);
                        return [4 /*yield*/, server_1.Http_EditStorage("BoxBookingOperations?MOVEMENT", items).then(function (data) {
                                toastr.success("Samples successfully reallocated");
                            }).catch(function (error) {
                                toastr.error(error);
                            })];
                    case 1:
                        _a.sent();
                        // Refresh slots for database change
                        return [4 /*yield*/, this.storageOperations.updateSlots()];
                    case 2:
                        // Refresh slots for database change
                        _a.sent();
                        this.updated = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericBoxReader.prototype, "slots", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], GenericBoxReader.prototype, "gParents", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], GenericBoxReader.prototype, "parents", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", container_1.Container)
    ], GenericBoxReader.prototype, "gParent", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", container_1.Container)
    ], GenericBoxReader.prototype, "parent", void 0);
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericBoxReader.prototype, "boxName", void 0);
    GenericBoxReader = __decorate([
        aurelia_dependency_injection_1.transient(),
        __metadata("design:paramtypes", [])
    ], GenericBoxReader);
    return GenericBoxReader;
}());
exports.GenericBoxReader = GenericBoxReader;
//# sourceMappingURL=generic-box-reader.js.map