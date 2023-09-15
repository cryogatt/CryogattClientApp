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
var resources_1 = require("../resources");
var auth_service_1 = require("../auth/auth-service");
var toastr = require("toastr");
var Login = /** @class */ (function () {
    // Constructor
    function Login(aurelia, authService, router) {
        this.aurelia = aurelia;
        this.authService = authService;
        this.router = router;
        // Read the software version
        this.softwareVersion = resources_1.Resources.cryogattWebVersion;
    }
    // Export a set of data records
    Login.prototype.login = function () {
        var _this = this;
        // Test the user name and password
        if (this.userName && this.password) {
            // Authenticate and set up the session
            this.authService.login(this.userName, this.password)
                .then(function () {
                // Switch back to the default route
                _this.router.navigateToRoute('materials', {}, { replace: true });
            })
                .catch(function (error) {
                // Error
                toastr.error(error);
            });
        }
        else {
            // Error
            toastr.error('The user name and password cannot be empty.');
        }
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], Login.prototype, "softwareVersion", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], Login.prototype, "userName", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], Login.prototype, "password", void 0);
    Login = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, auth_service_1.AuthService, aurelia_router_1.Router])
    ], Login);
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.js.map