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
var aurelia_router_1 = require("aurelia-router");
var generic_storage_item_1 = require("../generic-storage-item");
var container_1 = require("./container");
var json_map_1 = require("../../api/json-map");
var storage_type_1 = require("../storage-type");
var Containers = /** @class */ (function () {
    // Constructor
    function Containers(dialogService, router) {
        this.dialogService = dialogService;
        this.router = router; // Might be able to get rid of this?
    }
    Containers_1 = Containers;
    Containers.getAuditMode = function () {
        return Containers_1.auditMode;
    };
    Containers.setAuditMode = function (status) {
        Containers_1.auditMode = status;
    };
    // Generate a new item
    Containers.prototype.getNew = function () {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.CONTAINER;
        storedItem.containedType = this.containsTypeSingular;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleGenericContainer;
        storedItem.convertFrom = json_map_1.Server_ConvertFromGenericContainer;
        storedItem.item = new container_1.Container();
        storedItem.item.uid = null;
        storedItem.item.addedDate = new Date();
        storedItem.item.type = "";
        storedItem.item.containsType = "";
        return storedItem;
    };
    // Generate a new item based on the current selection
    Containers.prototype.getSelected = function (item) {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.CONTAINER;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleGenericContainer;
        storedItem.convertFrom = json_map_1.Server_ConvertFromGenericContainer;
        // Copy existing properties plus - we want to keep the validate() method; hence this longer approach for now
        storedItem.item = new container_1.Container();
        storedItem.item.uid = item.uid;
        storedItem.item.name = item.name;
        storedItem.item.type = item.type;
        storedItem.item.addedDate = item.addedDate;
        storedItem.item.containsQty = item.containsQty;
        storedItem.item.containsType = item.containsType;
        return storedItem;
    };
    Containers.auditMode = false;
    Containers = Containers_1 = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogService, aurelia_router_1.Router])
    ], Containers);
    return Containers;
    var Containers_1;
}());
exports.Containers = Containers;
//# sourceMappingURL=containers.js.map