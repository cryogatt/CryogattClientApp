"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_framework_2 = require("aurelia-framework");
var generic_storage_item_1 = require("../generic-storage-item");
var json_map_1 = require("../../api/json-map");
var storage_type_1 = require("../storage-type");
var material_1 = require("./material");
var Materials = /** @class */ (function () {
    function Materials() {
    }
    // Generate a new item based
    Materials.prototype.getNew = function () {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.MATERIAL;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleMaterial;
        storedItem.convertFrom = json_map_1.Server_ConvertFromMaterialExtended;
        storedItem.item = new material_1.MaterialBatch();
        return storedItem;
    };
    // Generate a new item based on the current selection
    Materials.prototype.getSelected = function (item) {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.MATERIAL;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleMaterial;
        storedItem.convertFrom = json_map_1.Server_ConvertFromMaterialExtended;
        storedItem.item = Object.assign({}, item);
        return storedItem;
    };
    Materials = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_2.autoinject()
    ], Materials);
    return Materials;
}());
exports.Materials = Materials;
//# sourceMappingURL=materials.js.map