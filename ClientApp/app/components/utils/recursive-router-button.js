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
var RecursiveRouterButton = /** @class */ (function () {
    function RecursiveRouterButton(element, router) {
        this.element = element;
        this.router = router;
    }
    RecursiveRouterButton.prototype.navigate = function () {
        // Navigate to this path
        this.params = encodeURIComponent(this.path + "%0B" + String(this.id) + "%0B" + this.name);
        this.router.navigateToRoute(this.route, { item: this.params });
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RecursiveRouterButton.prototype, "route", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Number)
    ], RecursiveRouterButton.prototype, "id", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RecursiveRouterButton.prototype, "path", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RecursiveRouterButton.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], RecursiveRouterButton.prototype, "title", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Boolean)
    ], RecursiveRouterButton.prototype, "enabled", void 0);
    RecursiveRouterButton = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [Element, aurelia_router_1.Router])
    ], RecursiveRouterButton);
    return RecursiveRouterButton;
}());
exports.RecursiveRouterButton = RecursiveRouterButton;
//# sourceMappingURL=recursive-router-button.js.map