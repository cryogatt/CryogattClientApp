"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_fetch_client_1 = require("aurelia-fetch-client");
var resources_1 = require("../resources");
var reader_types_1 = require("../reader/reader-types");
var reader_api_path_broker_1 = require("./reader-api-path-broker");
var readerClient = new aurelia_fetch_client_1.HttpClient();
var $ = require('jquery');
function Reader_Init() {
    // Configure the client
    readerClient.configure(function (config) {
        config
            .withBaseUrl(resources_1.Resources.readerWebApiHost)
            .withDefaults({
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            }
        })
            .withInterceptor({
            request: function (request) {
                console.log("Requesting " + request.method + " " + request.url);
                return request;
            },
            response: function (response) {
                console.log("Received " + response.status + " " + response.url);
                return response;
            }
        });
    });
}
exports.Reader_Init = Reader_Init;
// List all readers
function Reader_ListAll() {
    // List all configured readers
    return (Reader_GetJson('readers'));
}
exports.Reader_ListAll = Reader_ListAll;
// Read specific reader
function Reader_Read(readerId) {
    if (readerId !== reader_types_1.ReaderType.CRYOGATT_R10102.toString())
        return (Reader_GetJson('readers/' + readerId));
    return new Promise(function (resolve) {
        return resolve({
            Id: 5,
            AntennaQuantity: 100,
            Name: "Cryogatt 10* 10 Vial Reader P/N R10102",
            TagsPerAntenna: 1,
            URL: ""
        });
    });
}
exports.Reader_Read = Reader_Read;
// Perform ISO 15693 Inventory
function Reader_Inventory(readerId) {
    var apiPath = reader_api_path_broker_1.GetReader_InventoryPath(readerId);
    // Fetch the data using the RFID Reader Web API
    return (Reader_GetJson(apiPath));
}
exports.Reader_Inventory = Reader_Inventory;
// Perform ISO 15693 Block 0 (Ident)
function Reader_Ident(readerId, tagId, antennaNo) {
    var apiPath = reader_api_path_broker_1.GetReader_IdentPath(readerId, tagId, antennaNo);
    return Reader_GetJson(apiPath);
}
exports.Reader_Ident = Reader_Ident;
// Fetch software version
function Reader_GetSoftwareVersion() {
    // Fetch the server software version using the Web API 
    return (Reader_GetJson('version'));
}
exports.Reader_GetSoftwareVersion = Reader_GetSoftwareVersion;
// Try to fetch the service version to test the connection
function Reader_CanConnect() {
    return (readerClient.fetch('version')
        .then(function (response) {
        if (response) {
            return true;
        }
        else {
            return false;
        }
    }).catch(function (error) {
        console.log(error);
        return false;
    }));
}
exports.Reader_CanConnect = Reader_CanConnect;
function Reader_GetTemp(readerId, probeId) {
    if (probeId === void 0) { probeId = 0; }
    return Reader_GetJson('Cold10102Reader/GetTemp/' + probeId);
}
exports.Reader_GetTemp = Reader_GetTemp;
function Reader_GetBatteryLife(readerId) {
    return Reader_GetJson('Cold10102Reader/GetBatteryLife');
}
exports.Reader_GetBatteryLife = Reader_GetBatteryLife;
// Generic JSON GET handler
function Reader_GetJson(apiPath) {
    if (apiPath) {
        // Get the data using the RFID Reader Web API
        return (readerClient.fetch(apiPath)
            .then(function (response) {
            if (!Reader_requestSucceeded(response.status)) {
                // Obtain the error message from the JSON
                return (response.json()
                    .then(function (data) {
                    if (data.hasOwnProperty('Message')) {
                        // An error has occurred, e.g. no data
                        console.log(data['Message']);
                        return Promise.reject(data['Message']);
                    }
                    else {
                        // Some other json was returned, which is still an error
                        console.log(data);
                        return Promise.reject("An error occurred while processing the GET operation.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Reader_GetJson(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                // Success
                return (response.json()
                    .then(function (data) {
                    if (data) {
                        // Successful parse of the JSON
                        return Promise.resolve(data);
                    }
                    else {
                        // Error during JSON parse
                        console.log(data);
                        return Promise.reject("An error occured while parsing the returned data.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Reader_GetJson(): catch on response.json() success promise - " + error);
                    return Promise.reject(error);
                }));
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Reader_GetJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Reader_GetJson(): invalid apiPath");
        return Promise.reject("An invalid RESTful API path was submitted while getting the data.");
    }
}
// Generic JSON POST handler
function Reader_PostJson(apiPath) {
    if (apiPath) {
        // Post the data using the RFID Reader Web API
        return (readerClient.fetch(apiPath, {
            method: 'post'
        }).then(function (response) {
            if (!Reader_requestSucceeded(response.status)) {
                // Obtain the error message from the JSON
                return (response.json()
                    .then(function (data) {
                    if (data.hasOwnProperty('Message')) {
                        // An error has occurred, e.g. no data
                        console.log(data['Message']);
                        return Promise.reject(data['Message']);
                    }
                    else {
                        // Some other json was returned, which is still an error
                        console.log(data);
                        return Promise.reject("An error occurred while processing the POST operation.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Reader_PostJson(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                return (response.json()
                    .then(function (data) {
                    if (data) {
                        // Successful parse of the JSON
                        return Promise.resolve(data);
                    }
                    else {
                        // Error during JSON parse
                        console.log(data);
                        return Promise.reject("An error occured while parsing the returned data.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Reader_PostJson(): catch on response.json() success promise - " + error);
                    return Promise.reject(error);
                }));
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Reader_PostJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Reader_PostJson(): invalid apiPath - " + apiPath);
        return Promise.reject("An invalid RESTful API path or items data was submitted.");
    }
}
function Reader_requestSucceeded(status) {
    // Assume for now that success is always response code 200
    return (status && status == 200);
}
//# sourceMappingURL=reader.js.map