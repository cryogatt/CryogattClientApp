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
// Generic features of a picklist item
var Order = /** @class */ (function () {
    function Order() {
    }
    Order.prototype.validate = function () {
        // Ensure sender has been selected
        if (!this.sender) {
            return Promise.reject('Sender required!');
        }
        // Ensure recipient has been selected
        if (!this.recipient) {
            return Promise.reject('Recipient required!');
        }
        // Check sender does not equal recipient
        if (this.sender === this.recipient) {
            return Promise.reject('The sender and recipient cannot be the same!');
        }
        // Ensure Consignment has been entered and is a valid length
        if (!this.consignment_no) {
            return Promise.reject('Consignment required!');
        }
        else if (this.consignment_no.length > 50) {
            return Promise.reject('Consignment must be no longer than 50 characters!');
        }
        return Promise.resolve();
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Number)
    ], Order.prototype, "uid", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Order.prototype, "sender", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Order.prototype, "recipient", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Order.prototype, "consignment_no", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Order.prototype, "notes", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Order.prototype, "sample_qty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Order.prototype, "status", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], Order.prototype, "ordered_date", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], Order.prototype, "dispatched_date", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], Order.prototype, "arrived_date", void 0);
    Order = __decorate([
        aurelia_framework_1.transient()
    ], Order);
    return Order;
}());
exports.Order = Order;
//# sourceMappingURL=order.js.map