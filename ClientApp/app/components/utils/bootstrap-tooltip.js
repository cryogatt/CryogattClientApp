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
var $ = require('jquery');
require("bootstrap");
var BootstrapTooltip = /** @class */ (function () {
    function BootstrapTooltip(element) {
        this.element = element;
    }
    BootstrapTooltip.prototype.bind = function () {
        $(this.element).tooltip({ title: this.title });
    };
    BootstrapTooltip.prototype.unbind = function () {
        $(this.element).tooltip('destroy');
    };
    BootstrapTooltip.prototype.titleChanged = function () {
        $(this.element).data('bs.tooltip', false);
        $(this.element).tooltip({ title: this.title });
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], BootstrapTooltip.prototype, "title", void 0);
    BootstrapTooltip = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.customAttribute('bootstrap-tooltip'),
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Object])
    ], BootstrapTooltip);
    return BootstrapTooltip;
}());
exports.BootstrapTooltip = BootstrapTooltip;
//# sourceMappingURL=bootstrap-tooltip.js.map