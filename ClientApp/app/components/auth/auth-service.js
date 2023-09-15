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
var aurelia_templating_resources_1 = require("aurelia-templating-resources");
var server_1 = require("../api/server");
var AuthService = /** @class */ (function () {
    function AuthService(aurelia, bindingSignaler) {
        this.aurelia = aurelia;
        this.bindingSignaler = bindingSignaler;
        // Retrieve any existing session from localStorage
        this.session = JSON.parse(localStorage.getItem('token') || null);
    }
    // Handle login request
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return (server_1.Http_Authenticate(username, password)
            .then(function (session) {
            // Store the session information
            localStorage.setItem('token', JSON.stringify(session));
            _this.session = session;
            // Notify listeners
            _this.bindingSignaler.signal('signal-authentication-changed');
            // Update the HTTP client to include the token
            server_1.Http_UpdateToken(session.access_token);
        }).catch(function (error) {
            // Error
            return Promise.reject(error);
        }));
    };
    // Handle logout request
    AuthService.prototype.logout = function () {
        // Clear out the session and update the signal state
        this.endSession();
        // Switch back to the login shell
        var router = aurelia_framework_1.Container.instance.get(aurelia_router_1.Router);
        router.navigateToRoute('login');
    };
    // Reset the session state
    AuthService.prototype.endSession = function () {
        // Clear out the session information
        localStorage.setItem('token', null);
        this.session = null;
        // Notify listeners
        this.bindingSignaler.signal('signal-authentication-changed');
        // Update the HTTP client to include the cleared token
        server_1.Http_UpdateToken(null);
    };
    // Retrieve the token
    AuthService.prototype.getToken = function () {
        return (this.session.access_token);
    };
    // Retrieve the current username
    AuthService.prototype.getCurrentUser = function () {
        // Check role information in token
        if (this.session && this.session !== null && this.session !== "") {
            var token = this.parseToken();
            if (token && token.hasOwnProperty('unique_name')) {
                return token.unique_name;
            }
        }
        return ("");
    };
    // Allow other modules to check whether the user is authenticated  
    AuthService.prototype.isAuthenticated = function () {
        // Test for a valid session
        if (this.session) {
            // Test for token expiry
            var token = this.parseToken();
            if (token && token.hasOwnProperty('exp')) {
                // Compare the date-time with the current date-time
                if (token.exp >= Math.round(new Date().valueOf() / 1000)) {
                    return true;
                }
                else {
                    // Clean up the service
                    this.endSession();
                }
            }
        }
        return false;
    };
    // Allow other modules to check whether the user is authorised for a particular function
    AuthService.prototype.isAuthorised = function () {
        if (this.isAuthenticated()) {
            // Check role information in token
            if (this.session) {
                var token = this.parseToken();
                if (token && token.hasOwnProperty('role')) {
                    // TODO JMJ this is where further checking needs to occur to handle specific roles
                    return true;
                }
            }
        }
        return false;
    };
    // Decodes the message part of the token and returns it as a JSON structure
    AuthService.prototype.parseToken = function () {
        var token = null;
        if (this.session) {
            // This try/catch is important here, because if this code fails during page load/refresh, the uncaught exception causes
            // the page to hang, displaying only "Loading...". At the time I worked this out, only Chrome (61) reported the unexception
            // whereas Firefox (56) failed silently.
            try {
                // If the token format is valid it should be <header>.<message>
                var parts = this.session.access_token.split('.');
                if (parts && parts.length > 1) {
                    // Base64 decode the <message> part, and extract the JSON
                    token = JSON.parse(atob(parts[1]));
                }
            }
            catch (e) {
                // Error
                console.log("AuthService.isAuthorised(): failed to parse access_token");
            }
        }
        return token;
    };
    AuthService = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_framework_1.Aurelia, aurelia_templating_resources_1.BindingSignaler])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map