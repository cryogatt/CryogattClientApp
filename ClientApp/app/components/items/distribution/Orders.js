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
var order_1 = require("./order");
var json_map_1 = require("../../api/json-map");
var storage_type_1 = require("../storage-type");
var Orders = /** @class */ (function () {
    function Orders() {
    }
    // Generate a new item based
    Orders.prototype.getNew = function () {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.ORDER;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleOrder;
        storedItem.convertFrom = json_map_1.Server_ConvertFromOrderExtended;
        storedItem.item = new order_1.Order();
        return storedItem;
    };
    // Generate a new item based on the current selection
    Orders.prototype.getSelected = function (item) {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.ORDER;
        storedItem.convertTo = json_map_1.Server_ConvertToSingleOrder;
        storedItem.convertFrom = json_map_1.Server_ConvertFromOrderExtended;
        storedItem.item = Object.assign({}, item);
        return storedItem;
    };
    Orders = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_2.autoinject()
    ], Orders);
    return Orders;
}());
exports.Orders = Orders;
//# sourceMappingURL=Orders.js.map