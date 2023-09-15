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
var storage_modal_mode_1 = require("../storage-modal-mode");
// Generic features of a user
var User = /** @class */ (function () {
    function User() {
    }
    // Data-level input validation for the form
    User.prototype.validate = function (mode) {
        // Check username has been entered and is a suitable length
        if (!this.userName) {
            return Promise.reject('Username required!');
        }
        else if (this.userName.length > 50 || this.userName.length < 5) {
            return Promise.reject('Username must be between 5 and 50 characters!');
        }
        // Ensure first name has been entered and is a suitable length
        if (!this.firstName) {
            return Promise.reject('First name required!');
        }
        else if (this.userName.length > 50) {
            return Promise.reject('first name must be no longer than 50 characters!');
        }
        // Ensure last name has been entered and is a suitable length
        if (!this.lastName) {
            return Promise.reject('Last name required!');
        }
        else if (this.userName.length > 50) {
            return Promise.reject('Last name must be no longer than 50 characters!');
        }
        // Ensure email has been entered and is a suitable length
        if (!this.email) {
            return Promise.reject('Email required!');
        }
        else if (this.email.length > 50) {
            return Promise.reject('Email must be no longer than 50 characters!');
        }
        // Ensure site has been selected
        if (!this.site) {
            return Promise.reject('Site required!');
        }
        // Ensure password has been entered and is a suitable length
        if (!this.password) {
            return Promise.reject('Password required!');
        }
        else if (this.password.length > 50 || this.password.length < 5) {
            return Promise.reject('Password must be between 5 and 50 characters!');
        }
        // Check for password-related errors
        if (this.password !== this.confirmPassword || (mode === storage_modal_mode_1.StorageModalMode.CREATE && !this.password)) {
            // The passwords should always match
            return Promise.reject('The password must match the confirmation password, and must not be empty.');
        }
        else {
            // Success
            return Promise.resolve();
        }
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], User.prototype, "uid", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "userName", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "firstName", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "lastName", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "addedDate", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "updatedDate", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isAdministrator", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "confirmPassword", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "site", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], User.prototype, "group", void 0);
    User = __decorate([
        aurelia_framework_1.transient()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map