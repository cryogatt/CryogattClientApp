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
var server_1 = require("../../api/server");
var container_1 = require("./container");
var storage_modal_mode_1 = require("../storage-modal-mode");
var toastr = require("toastr");
var json_map_1 = require("../../api/json-map");
var container_ident_1 = require("./container-ident");
// Generic features of a storage container
var StorageContainer = /** @class */ (function () {
    function StorageContainer() {
        this.canShowQty = false;
        this.canShowContainsType = false;
    }
    StorageContainer.prototype.bind = function () {
        if (this.mode !== storage_modal_mode_1.StorageModalMode.VIEW) {
            // Retrieve the container types
            this.loadGeneralTypes();
        }
        this.container.containsQty = !this.container.containsQty ? 0 : this.container.containsQty;
    };
    // Retrieve the General types
    StorageContainer.prototype.loadGeneralTypes = function () {
        var _this = this;
        // Fetch the (this container) types using the Web API 
        server_1.Http_GetContainerGeneralTypes(3) // TODO Add enum for levels - Hardcoded for root 
            .then(function (data) {
            if (data && data.hasOwnProperty('Types')) {
                _this.generalTypes = json_map_1.Server_ConvertToGeneralTypes(data);
                _this.generalType = _this.generalTypes[0];
                _this.loadSubTypes();
            }
        }).catch(function (error) {
            // An error has occurred, e.g. no data
            toastr.error(error);
        });
    };
    StorageContainer.prototype.loadSubTypes = function () {
        var _this = this;
        if (this.mode === storage_modal_mode_1.StorageModalMode.CREATE) {
            // Fetch the contained types using the Web API
            server_1.Http_GetContainerSpecificTypes(this.generalType.ident)
                .then(function (data) {
                if (data && data.hasOwnProperty('Subtypes')) {
                    _this.subtypes = json_map_1.Server_ConvertToSubtypes(data);
                    _this.container.type = _this.subtypes[0].description;
                    // Call the selected type for the default value
                    _this.subTypeSelected();
                }
            }).catch(function (error) {
                // An error has occurred, e.g. no data
                toastr.error(error);
            });
        }
    };
    StorageContainer.prototype.subTypeSelected = function () {
        // Upon creating storage record offer change to add contained types
        this.loadContainedTypes();
    };
    StorageContainer.prototype.loadContainedTypes = function () {
        var _this = this;
        // TODO Replace with call to server - Hardcoded for now as dewar is the only item this applies to
        if (this.generalType.ident === 4) {
            this.canShowQty = true;
            this.canShowContainsType = true;
            // Fetch the contained types using the Web API
            server_1.Http_GetContainerSpecificTypes(3) // Rack
                .then(function (data) {
                if (data) {
                    _this.containedTypes = json_map_1.Server_ConvertToSubtypes(data);
                }
            }).catch(function (error) {
                // An error has occurred, e.g. no data
                toastr.error(error);
            });
        }
        else {
            this.canShowQty = false;
            this.canShowContainsType = false;
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", container_1.Container)
    ], StorageContainer.prototype, "container", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Number)
    ], StorageContainer.prototype, "mode", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], StorageContainer.prototype, "generalTypes", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", container_ident_1.GeneralType)
    ], StorageContainer.prototype, "generalType", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", container_ident_1.Subtype)
    ], StorageContainer.prototype, "subtype", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], StorageContainer.prototype, "subtypes", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], StorageContainer.prototype, "canShowAddedDate", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], StorageContainer.prototype, "addedDate", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], StorageContainer.prototype, "canShowQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], StorageContainer.prototype, "canShowContainsType", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], StorageContainer.prototype, "containedTypes", void 0);
    StorageContainer = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], StorageContainer);
    return StorageContainer;
}());
exports.StorageContainer = StorageContainer;
//# sourceMappingURL=storage-container.js.map