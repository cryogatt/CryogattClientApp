"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
var aurelia_framework_1 = require("aurelia-framework");
require("bootstrap/dist/css/bootstrap.css");
require("bootstrap");
var server_1 = require("./app/components/api/server");
var reader_1 = require("./app/components/api/reader");
var json_map_1 = require("./app/components/api/json-map");
var auth_service_1 = require("./app/components/auth/auth-service");
var resources_1 = require("./app/components/resources");
var toastr = require("toastr");
function configure(aurelia) {
    aurelia.use.standardConfiguration();
    if (IS_DEV_BUILD) {
        aurelia.use.developmentLogging();
    }
    // Use of aurelia-dialog
    aurelia.use.plugin(aurelia_framework_1.PLATFORM.moduleName('aurelia-dialog'));
    // Set the server API path
    if (IS_DEV_BUILD) {
        resources_1.Resources.cryogattWebApiHost = resources_1.Resources.cryogattDevHost;
    }
    else {
        // Get the calling hostname, as it is assumed that the API resides on the same server
        console.log("PROD BUILD");
        //   Resources.cryogattWebApiHost = Resources.cryogattDevHost; // TODO Change for release.
        resources_1.Resources.cryogattWebApiHost = window.location.protocol + "//" + window.location.hostname + resources_1.Resources.cryogattWebApiBase;
    }
    // Set up server interface
    server_1.Http_Init();
    // Set up RFID reader interface
    resources_1.Resources.readerWebApiHost = window.location.protocol + "//" + resources_1.Resources.readerWebApiHost + resources_1.Resources.readerWebApiBase;
    reader_1.Reader_Init();
    var authService = aurelia_framework_1.Container.instance.get(auth_service_1.AuthService);
    if (authService.isAuthenticated()) {
        // Refresh the Http interface with the token
        server_1.Http_UpdateToken(authService.getToken());
    }
    // Read the server version
    resources_1.Resources.cryogattWebVersion = "Web v" + resources_1.Resources.cryogattWebClientVersion + " / API ";
    server_1.Http_GetSoftwareVersion()
        .then(function (data) {
        var serverVersion = json_map_1.Server_ConvertToVersion(data);
        if (serverVersion) {
            // Update the overall software version
            resources_1.Resources.cryogattWebVersion += "v" + serverVersion;
        }
        else {
            // Undefined server version
            resources_1.Resources.cryogattWebVersion += "unknown";
        }
        // Navigate to the app
        aurelia.start().then(function () { return aurelia.setRoot(aurelia_framework_1.PLATFORM.moduleName('app/components/app/app')); });
    }).catch(function (error) {
        // An error has occurred, e.g. no data
        toastr.error(error);
        // Undefined server version
        resources_1.Resources.cryogattWebVersion += "unknown";
        // Navigate to the app
        aurelia.start().then(function () { return aurelia.setRoot(aurelia_framework_1.PLATFORM.moduleName('app/components/app/app')); });
    });
}
exports.configure = configure;
//# sourceMappingURL=boot.js.map