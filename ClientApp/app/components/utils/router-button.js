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
var aurelia_router_1 = require("aurelia-router");
var RouterButton = /** @class */ (function () {
    function RouterButton(element, router) {
        this.element = element;
        this.router = router;
    }
    RouterButton.prototype.navigate = function () {
        // Navigate to this path
        this.router.navigateToRoute(this.route, { item: this.params });
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RouterButton.prototype, "route", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RouterButton.prototype, "params", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RouterButton.prototype, "title", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], RouterButton.prototype, "enabled", void 0);
    RouterButton = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [Element, aurelia_router_1.Router])
    ], RouterButton);
    return RouterButton;
}());
exports.RouterButton = RouterButton;
//# sourceMappingURL=router-button.js.map