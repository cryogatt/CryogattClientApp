"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Resources for the project, accessible from TypeScript
var Resources;
(function (Resources) {
    // Server API host name and path
    Resources.cryogattWebApiHost = "";
    Resources.cryogattWebApiBase = ':44390/api/v1/';
    //  export const cryogattWebApiBase: string = 'api/v1/';
    // Development server
    Resources.cryogattDevHost = 'https://localhost:44390/api/v1/';
    // export const cryogattDevHost: string = 'https://testserverapi20191102052813.azurewebsites.net/api/v1/';
    // Software versioning
    Resources.cryogattWebVersion = "";
    Resources.cryogattWebClientVersion = "1.0";
    // RFID Reader API hostname and path
    Resources.readerWebApiHost = 'localhost';
    Resources.readerWebApiBase = ':44301/api/v2/';
    // Box row and column counts - for now, this appears to be fixed
    Resources.boxRowCount = 10;
    Resources.boxColumnCount = 10;
})(Resources = exports.Resources || (exports.Resources = {}));
//# sourceMappingURL=resources.js.map