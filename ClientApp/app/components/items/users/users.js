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
var json_map_1 = require("../../api/json-map");
var generic_storage_1 = require("../generic-storage");
var storage_type_1 = require("../storage-type");
var generic_storage_item_1 = require("../generic-storage-item");
var user_1 = require("./user");
var Users = /** @class */ (function () {
    // Constructor
    function Users(storage) {
        this.storage = storage;
    }
    // Sets up the specific bindings for Users
    Users.prototype.bind = function () {
        // General storage properties
        this.storage.storageType = 'user';
        this.storage.type_singular = "User";
        this.storage.type_plural = "Users";
        this.storage.title = this.storage.type_plural;
        this.storage.apiPath = "users";
        // Set up the table schema
        this.storage.schema = new Map();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("userName", "User Name");
        this.storage.schema.set("firstName", "First Name");
        this.storage.schema.set("lastName", "Last Name");
        this.storage.schema.set("email", "Email");
        //  this.storage.schema.set("lastLoginDate", "Last Login");
        this.storage.schema.set("addedDate", "Added Date");
        this.storage.schema.set("updatedDate", "Updated Date");
        this.storage.schema.set("isAdministrator", "Administrator");
        // Command presence
        this.storage.canCreateItem = true;
        this.storage.canDeleteItem = true;
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        // Fetch the data using the Web API
        this.storage.fetch(this.storage.apiPath, json_map_1.Server_ConvertToUsers);
    };
    // Create a new user (launch modal dialogue)
    Users.prototype.create = function () {
        // Hand off to the generic object
        this.storage.create(this.getNew());
    };
    // Delete one or more users from the list
    Users.prototype.delete = function () {
        // Hand off to the generic object
        this.storage.delete(json_map_1.Server_ConvertToUsers);
    };
    // Edit a user (launch modal dialogue)
    Users.prototype.edit = function () {
        // Hand off to the generic object
        this.storage.edit(this.getSelected(this.storage.selectedItem));
    };
    // View a user (launch modal dialogue)
    Users.prototype.view = function () {
        // Hand off to the generic object
        this.storage.view(this.getSelected(this.storage.selectedItem));
    };
    // Generate a new item
    Users.prototype.getNew = function () {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.USER;
        storedItem.convertTo = json_map_1.Server_ConvertToUser;
        storedItem.convertFrom = json_map_1.Server_ConvertFromUser;
        storedItem.item = new user_1.User();
        storedItem.item.addedDate = new Date();
        return storedItem;
    };
    // Generate a new item based on the current selection
    Users.prototype.getSelected = function (item) {
        var storedItem = new generic_storage_item_1.GenericStorageItem();
        storedItem.storageType = storage_type_1.StorageType.USER;
        storedItem.convertTo = json_map_1.Server_ConvertToUser;
        storedItem.convertFrom = json_map_1.Server_ConvertFromUser;
        storedItem.item = Object.assign({}, item);
        return storedItem;
    };
    Users = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage])
    ], Users);
    return Users;
}());
exports.Users = Users;
//# sourceMappingURL=users.js.map