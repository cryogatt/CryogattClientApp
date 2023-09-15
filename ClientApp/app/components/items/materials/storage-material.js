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
var json_map_1 = require("../../api/json-map");
var storage_modal_mode_1 = require("../storage-modal-mode");
var toastr = require("toastr");
var material_1 = require("./material");
// Generic features of a storage material
var StorageMaterial = /** @class */ (function () {
    function StorageMaterial() {
    }
    StorageMaterial.prototype.bind = function () {
        var _this = this;
        if (this.mode !== storage_modal_mode_1.StorageModalMode.CREATE) {
            // Fetch the material using the Web API 
            server_1.Http_GetMaterial(this.material.uid)
                .then(function (data) {
                var item = json_map_1.Server_ConvertToMaterialExtended(data);
                if (item) {
                    // Store the result locally
                    _this.material = item;
                }
                else {
                    // Undefined item error
                    toastr.error("An error occurred, and the record could only be part-retrieved.");
                }
            }).catch(function (error) {
                // An error has occurred, e.g. no data
                toastr.error(error);
            });
        }
        else {
            this.cropList = this.material.cropList;
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", material_1.MaterialBatch)
    ], StorageMaterial.prototype, "material", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], StorageMaterial.prototype, "mode", void 0);
    __decorate([
        aurelia_framework_1.observable,
        __metadata("design:type", Object)
    ], StorageMaterial.prototype, "query", void 0);
    StorageMaterial = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], StorageMaterial);
    return StorageMaterial;
}());
exports.StorageMaterial = StorageMaterial;
//# sourceMappingURL=storage-material.js.map