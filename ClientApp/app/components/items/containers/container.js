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
// Generic features of a container
var Container = /** @class */ (function () {
    function Container() {
    }
    // Input validation for the form
    Container.prototype.validate = function () {
        // Check name has been entered and is a suitable length
        if (!this.name) {
            return Promise.reject('Name required!');
        }
        else if (this.name.length > 50) {
            return Promise.reject('Name must be no longer than 50 characters!');
        }
        else if (this.name.indexOf('$') !== -1) {
            return Promise.reject('Name cannot contain character: $');
        }
        // Check either type when entering non RFID enabled container has been given or tagIdent when reading tagged items
        if (!this.type && !this.tagIdent) {
            return Promise.reject('Type required!');
        }
        if (this.containsQty < 0) {
            return Promise.reject(this.name + ' cannot contain less than 0 items!');
        }
        // Success
        return Promise.resolve();
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Container.prototype, "uid", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Container.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Container.prototype, "type", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Container.prototype, "addedDate", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Container.prototype, "containsQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Container.prototype, "containsType", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Container.prototype, "tagIdent", void 0);
    Container = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], Container);
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=container.js.map