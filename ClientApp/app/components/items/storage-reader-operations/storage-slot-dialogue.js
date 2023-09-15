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
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_dialog_1 = require("aurelia-dialog");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var slot_1 = require("../../reader/data-structures/slot");
var slot_states_1 = require("../../reader/data-structures/slot-states");
var server_1 = require("../../api/server");
var json_map_1 = require("../../api/json-map");
var aurelia_templating_1 = require("aurelia-templating");
var aurelia_binding_1 = require("aurelia-binding");
var StorageSlotDialogue = /** @class */ (function () {
    // Constructor
    function StorageSlotDialogue(dialogController) {
        this.controller = dialogController;
    }
    StorageSlotDialogue.prototype.activate = function (model) {
        this.slot = model;
        // Determine the status of the slot and handle the display accordingly
        switch (this.slot.slotState) {
            case slot_states_1.SlotStates.OCCUPIED: {
                this.displayContainer();
                break;
            }
            case slot_states_1.SlotStates.MISSING: {
                this.displayMissingContainer();
                break;
            }
            case slot_states_1.SlotStates.NEW: {
                this.displayNewContainer();
                break;
            }
            case slot_states_1.SlotStates.MOVED: {
                this.displayMovedContainer();
                break;
            }
            case slot_states_1.SlotStates.RESERVED: {
                this.displayReservedContainer();
                break;
            }
        }
    };
    // Container correctly found in slot
    StorageSlotDialogue.prototype.displayContainer = function () {
        var _this = this;
        server_1.Http_GetSingleTagIdentity(this.slot.getRecordedUid()).then(function (data) {
            if (data) {
                _this.slot.recordedContainer = json_map_1.Server_ConvertToTagIdentity(data.Tags[0]);
                _this.title = _this.slot.recordedContainer.description;
            }
        }).catch(function (error) {
            console.error(error);
        });
    };
    StorageSlotDialogue.prototype.displayMissingContainer = function () {
        this.title = this.slot.recordedContainer.description + ' missing!';
    };
    StorageSlotDialogue.prototype.displayNewContainer = function () {
        this.title = 'New item ' + this.slot.observedContainer.description;
    };
    StorageSlotDialogue.prototype.displayMovedContainer = function () {
        this.title = this.slot.observedContainer.description + ' moved! ';
        this.subtitle = 'Belongs in position ' + this.slot.observedContainer.position + ' in ' + this.slot.observedContainer.parentUidDescription.get(this.slot.observedContainer.parentUidDescription.keys().next().value);
    };
    StorageSlotDialogue.prototype.displayReservedContainer = function () {
        var _this = this;
        server_1.Http_GetSingleTagIdentity(this.slot.getRecordedUid()).then(function (data) {
            // Valid response
            if (data.hasOwnProperty('Tags')) {
                // Set the recorded container
                _this.slot.recordedContainer = json_map_1.Server_ConvertToTagIdentity(data.Tags[0]);
                _this.title = _this.slot.observedContainer.description + ' in reserved slot!';
                _this.subtitle = _this.slot.observedContainer.description + ' found in slot reserved for ' + _this.slot.recordedContainer.description;
            }
        }).catch(function (error) {
            console.error(error);
        });
    };
    __decorate([
        aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
        __metadata("design:type", slot_1.Slot)
    ], StorageSlotDialogue.prototype, "slot", void 0);
    StorageSlotDialogue = __decorate([
        aurelia_dependency_injection_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], StorageSlotDialogue);
    return StorageSlotDialogue;
}());
exports.StorageSlotDialogue = StorageSlotDialogue;
//# sourceMappingURL=storage-slot-dialogue.js.map