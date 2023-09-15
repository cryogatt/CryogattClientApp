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
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_dialog_1 = require("aurelia-dialog");
var server_1 = require("../api/server");
var storage_modal_mode_1 = require("./storage-modal-mode");
var toastr = require("toastr");
// Generic stored item modal dialogue view model
var GenericStorageModal = /** @class */ (function () {
    // Constructor
    function GenericStorageModal(dialogController) {
        this.controller = dialogController;
    }
    GenericStorageModal.prototype.activate = function (model) {
        this.model = model;
        // Command bindings
        switch (this.model.mode) {
            case storage_modal_mode_1.StorageModalMode.CREATE:
                this.model.title = "Create New " + this.model.type_singular;
                this.model.canSave = true;
                //this.cropList = model.cropList;
                break;
            case storage_modal_mode_1.StorageModalMode.EDIT:
                this.model.title = "Edit " + this.model.type_singular;
                this.model.canSave = true;
                break;
            case storage_modal_mode_1.StorageModalMode.VIEW:
                this.model.title = "View " + this.model.type_singular;
                this.model.canEdit = true;
                break;
            default: {
                break;
            }
        }
        ;
    };
    //cropListChanged(newValue, oldValue) {
    //    // this will fire whenever the 'color' property changes
    //    this.cropList = newValue;
    //}
    // Save the changes / addition 
    GenericStorageModal.prototype.save = function () {
        var _this = this;
        // Validate the changes
        this.model.item.validate(this.model.mode)
            .then(function () {
            // Determine the object
            var item = _this.model.convertFrom(_this.model.item);
            // Determine the API based on the mode:
            if (_this.model.mode === storage_modal_mode_1.StorageModalMode.CREATE) {
                // Post the data using the Web API
                server_1.Http_AddItem(_this.model.apiPath, item)
                    .then(function (data) {
                    // Transform the newly created item into the internal format
                    var record = _this.model.convertTo(data);
                    // Notify the controller to close the window
                    _this.controller.ok(record);
                }).catch(function (error) {
                    // An error has occurred, e.g. no data, or invalid field values
                    toastr.error(error);
                });
            }
            else if (_this.model.mode === storage_modal_mode_1.StorageModalMode.EDIT) {
                // Post the data using the Web API
                server_1.Http_EditItem(_this.model.apiPath, _this.model.item.uid, item)
                    .then(function () {
                    // Switch back to view mode
                    _this.setViewMode();
                    // Notify the user
                    toastr.success("The record was successfully updated.");
                }).catch(function (error) {
                    // An error has occurred during the edit operation
                    toastr.error(error);
                    toastr.error("An error occurred while editing the container.");
                });
            }
        })
            .catch(function (error) {
            // Notify the user
            toastr.error(error);
        });
    };
    GenericStorageModal.prototype.edit = function () {
        // Swap to Edit mode
        this.setEditMode();
    };
    GenericStorageModal.prototype.cancel = function () {
        if (this.model.mode === storage_modal_mode_1.StorageModalMode.CREATE) {
            this.controller.cancel();
        }
        else if (this.model.mode === storage_modal_mode_1.StorageModalMode.EDIT) {
            this.controller.cancel();
        }
        else {
            // View mode - they might have edited, hence return the current item
            // this.controller.ok(this.model.item);
            this.controller.cancel(); //TODO Revist the  
        }
    };
    // Configure the settings for Edit mode
    GenericStorageModal.prototype.setEditMode = function () {
        // Set edit mode
        this.model.mode = storage_modal_mode_1.StorageModalMode.EDIT;
        this.model.title = "Edit a " + this.model.type_singular;
        this.model.canEdit = false;
        this.model.canSave = true;
    };
    // Configure the settings for View mode
    GenericStorageModal.prototype.setViewMode = function () {
        // Set view mode
        this.model.mode = storage_modal_mode_1.StorageModalMode.VIEW;
        this.model.title = "View a " + this.model.type_singular;
        this.model.canEdit = true;
        this.model.canSave = false;
    };
    GenericStorageModal = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], GenericStorageModal);
    return GenericStorageModal;
}());
exports.GenericStorageModal = GenericStorageModal;
//# sourceMappingURL=generic-storage-modal.js.map