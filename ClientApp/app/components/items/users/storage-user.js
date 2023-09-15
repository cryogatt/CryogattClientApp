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
var user_1 = require("./user");
var storage_modal_mode_1 = require("../storage-modal-mode");
var $ = require('jquery');
var toastr = require("toastr");
// Generic features of a storage user
var StorageUser = /** @class */ (function () {
    function StorageUser() {
    }
    StorageUser.prototype.bind = function () {
        var _this = this;
        // Fetch the Contacts
        server_1.Http_GetContacts()
            .then(function (data) {
            // Store the result locally
            _this.sites = data;
            if (_this.mode !== storage_modal_mode_1.StorageModalMode.CREATE) {
                // Fetch the user using the Web API 
                server_1.Http_GetUser(_this.user.uid)
                    .then(function (data) {
                    var item = json_map_1.Server_ConvertToUser(data);
                    if (item) {
                        // Store the result locally
                        _this.user = item;
                        // Bind the additional fields
                        _this.isAdministrator = _this.user.isAdministrator;
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
                _this.isAdministrator = _this.user.isAdministrator;
            }
        }).catch(function (error) {
            // An error has occurred, e.g. no data
            toastr.error(error);
            _this.sites = [];
        });
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", user_1.User)
    ], StorageUser.prototype, "user", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], StorageUser.prototype, "mode", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], StorageUser.prototype, "confirmPassword", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], StorageUser.prototype, "isAdministrator", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], StorageUser.prototype, "sites", void 0);
    StorageUser = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], StorageUser);
    return StorageUser;
}());
exports.StorageUser = StorageUser;
//# sourceMappingURL=storage-user.js.map