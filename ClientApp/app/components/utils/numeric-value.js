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
function getNumber(value) {
    var number = parseFloat(value);
    return !isNaN(number) && isFinite(value) ? number : NaN;
}
var NumericValue = /** @class */ (function () {
    function NumericValue(element) {
        var _this = this;
        this.blur = function () {
            // Blank input maps to a null value
            if (_this.element.value === "") {
                _this.value = null;
                return;
            }
            // Check for a valid number
            var number = getNumber(_this.element.value);
            if (isNaN(number)) {
                // Reset the input value
                _this.valueChanged();
            }
            else {
                _this.value = number;
            }
        };
        this.element = element;
    }
    NumericValue.prototype.valueChanged = function () {
        // Synchronize the input element with the bound value
        var number = getNumber(this.value);
        if (isNaN(number)) {
            this.element.value = "";
        }
        else {
            // Convert to a decimal number
            this.element.value = number.toString(10);
        }
    };
    // Add event handler
    NumericValue.prototype.bind = function () {
        this.valueChanged();
        this.element.addEventListener('blur', this.blur);
    };
    // Remove event handler
    NumericValue.prototype.unbind = function () {
        this.element.removeEventListener('blur', this.blur);
    };
    NumericValue = __decorate([
        aurelia_framework_1.customAttribute('numeric-value', aurelia_framework_1.bindingMode.twoWay),
        aurelia_framework_1.inject(aurelia_framework_1.DOM.Element),
        __metadata("design:paramtypes", [Object])
    ], NumericValue);
    return NumericValue;
}());
exports.NumericValue = NumericValue;
//# sourceMappingURL=numeric-value.js.map