"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_fetch_client_1 = require("aurelia-fetch-client");
var resources_1 = require("../resources");
var httpClient = new aurelia_fetch_client_1.HttpClient();
var $ = require('jquery');
function Http_Init() {
    // Configure the client
    httpClient.configure(function (config) {
        config
            .withBaseUrl(resources_1.Resources.cryogattWebApiHost)
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
exports.Http_Init = Http_Init;
function Http_UpdateToken(token) {
    if (token && token !== "") {
        // Configure the client with the token
        httpClient.configure(function (config) {
            config.withDefaults({
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-Requested-With': 'Fetch'
                }
            });
        });
    }
    else {
        // Configure the client without the token
        httpClient.configure(function (config) {
            config.withDefaults({
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'Fetch'
                }
            });
        });
    }
}
exports.Http_UpdateToken = Http_UpdateToken;
// Authenticate with the server
function Http_Authenticate(username, password) {
    if (username && password) {
        // Get the data using the Web API
        return (httpClient.fetch('users/tokens', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: $.param({ username: username, password: password, grant_type: "password" })
        }).then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
                // Obtain the error message from the JSON
                return (response.json()
                    .then(function (data) {
                    if (data.hasOwnProperty('error_description')) {
                        // An error has occurred, e.g. no data
                        console.log(data['error_description']);
                        return Promise.reject(data['error_description']);
                    }
                    else {
                        // Some other json was returned, which is still an error
                        console.log(data);
                        return Promise.reject("An error occurred while processing the POST operation.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Http_Authenticate(): catch on response.json() promise - " + error);
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
                    console.log("Http_Authenticate(): catch on response.json() success promise - " + error);
                    return Promise.reject(error);
                }));
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_Authenticate(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle error
        console.log("Authenticate: undefined");
        return Promise.reject("An error occurred while checking the username and password.");
    }
}
exports.Http_Authenticate = Http_Authenticate;
// Fetch container types (i.e. specific idents) for a given level - default to root
function Http_GetContainerGeneralTypes(level) {
    var apiPath = 'ContainerIdents';
    if (level) {
        apiPath += "?LEVEL=" + level;
    }
    // Fetch the data using the Web API
    return (Http_GetJson(apiPath));
}
exports.Http_GetContainerGeneralTypes = Http_GetContainerGeneralTypes;
// Fetch container types (i.e. specific idents)
function Http_GetContainerSpecificTypes(type) {
    // Fetch the data using the Web API
    if (type) {
        return (Http_GetJson('ContainerIdents/' + type));
    }
    else {
        // Handle error
        console.log("Fetch container types: undefined or empty parameter");
        return Promise.reject("An error occurred while reading the container types: no type was specified.");
    }
}
exports.Http_GetContainerSpecificTypes = Http_GetContainerSpecificTypes;
// Fetch container contents level (i.e. primary container)
function Http_GetContainerContentsLevel(uid) {
    // Fetch the data using the Web API
    return (Http_GetJson('ContainerLevel' + '/' + uid));
}
exports.Http_GetContainerContentsLevel = Http_GetContainerContentsLevel;
// Fetch tag ident type description from server
function Http_GetTagIdentTypeDesc(tagIdent) {
    // Fetch the data using the Web API
    return (Http_GetJson("BookingOperations" + "/" + parseInt(tagIdent, 16)));
}
exports.Http_GetTagIdentTypeDesc = Http_GetTagIdentTypeDesc;
// Fetch the primary container records for a given parent
function Http_GetParentPrimaryContainers(parentUid) {
    // Fetch the data using the Web API
    return (Http_GetJson("PrimaryContainers" + "/" + parentUid));
}
exports.Http_GetParentPrimaryContainers = Http_GetParentPrimaryContainers;
// Fetch either containers / materials / history / picklist, i.e. any list
function Http_GetItems(apiPath) {
    // Fetch the data using the Web API 
    return (Http_GetJson(apiPath));
}
exports.Http_GetItems = Http_GetItems;
// Fetch either containers / materials / history / picklist, i.e. any list
function Http_GetBatchItems(type, id) {
    var apiPath = "batches";
    if (type) {
        apiPath += "?batch_type=" + type;
    }
    else {
        // Handle error
        console.log("Fetch batch items: undefined or empty batch type");
        return Promise.reject("An error occurred while reading the batch: no type was specified.");
    }
    if (id) {
        apiPath += "&id=" + id;
    }
    else {
        // Handle error
        console.log("Fetch batch items: undefined or empty id");
        return Promise.reject("An error occurred while reading the batch: no id was specified.");
    }
    // Fetch the data using the Web API 
    return (Http_GetJson(apiPath));
}
exports.Http_GetBatchItems = Http_GetBatchItems;
// Fetch Orders
function Http_GetOrder(id) {
    // Fetch the data using the Web API 
    return (Http_GetJson('Orders' + '/' + id));
}
exports.Http_GetOrder = Http_GetOrder;
// Fetch Orders
function Http_GetListOfOrders(Status) {
    // Fetch the data using the Web API 
    return (Http_GetJson('Orders' + '?' + Status));
}
exports.Http_GetListOfOrders = Http_GetListOfOrders;
// Fetch material
function Http_GetMaterial(id) {
    // Fetch the data using the Web API 
    return (Http_GetJson('materials' + '/' + id));
}
exports.Http_GetMaterial = Http_GetMaterial;
// Fetch user
function Http_GetUser(id) {
    // Fetch the data using the Web API 
    return (Http_GetJson('users' + '/' + id));
}
exports.Http_GetUser = Http_GetUser;
// Fetch software version
function Http_GetSoftwareVersion() {
    // Fetch the server software version using the Web API 
    return (Http_GetJson('version'));
}
exports.Http_GetSoftwareVersion = Http_GetSoftwareVersion;
function Http_AddItem(apiPath, item) {
    // Post the data using the Web API
    return (Http_PostJson(apiPath, item, true));
}
exports.Http_AddItem = Http_AddItem;
function Http_AddItems(apiPath, items) {
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}
exports.Http_AddItems = Http_AddItems;
function Http_AddItemsToShipment(items, apiPath) {
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}
exports.Http_AddItemsToShipment = Http_AddItemsToShipment;
function Http_AuditItem(items) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (Http_PostJson("History/" + items, items, false))];
                case 1: 
                // Post the data using the Web API
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.Http_AuditItem = Http_AuditItem;
function Http_AuditPrimaryContainers(items) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (Http_PostJson("History", items, false))];
                case 1: 
                // Post the data using the Web API
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.Http_AuditPrimaryContainers = Http_AuditPrimaryContainers;
function Http_GetTagResponse(apiPath, items) {
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, true));
}
exports.Http_GetTagResponse = Http_GetTagResponse;
// Get the identity of a single tags
function Http_GetSingleTagIdentity(tagUid) {
    var apiPath = 'BookingOperations?UIDS=' + tagUid;
    // Post the data using the Web API
    return (Http_GetJson(apiPath).then(function (data) {
        return data;
    }));
}
exports.Http_GetSingleTagIdentity = Http_GetSingleTagIdentity;
// Get the identity of many tags
function Http_PostTagsIdentity(items) {
    var apiPath = "RFID";
    var uids = [];
    items.forEach(function (tag) { return uids.push(tag.UID[0]); });
    // Post the data using the Web API
    return (Http_PostJson(apiPath, uids, true));
}
exports.Http_PostTagsIdentity = Http_PostTagsIdentity;
// Get the identity of many tags
function Http_GetTagsIdentity(items) {
    var apiPath = 'BookingOperations?';
    for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < items[i].UID.length; j++) {
            // Append on new addition apart from first
            if (!(i === 0 && j === 0)) {
                apiPath += "&";
            }
            apiPath += "UIDS=" + items[i].UID[j];
        }
    }
    // Post the data using the Web API
    return (Http_GetJson(apiPath).then(function (data) {
        return data;
    }));
}
exports.Http_GetTagsIdentity = Http_GetTagsIdentity;
function Http_GetTagIdentity(apiPath) {
    // Post the data using the Web API
    return (Http_GetJson(apiPath));
}
exports.Http_GetTagIdentity = Http_GetTagIdentity;
function Http_GetContainerParents(apiPath, id) {
    // Fetch the server software version using the Web API 
    return (Http_GetJson('ContainerParent' + '/' + id));
}
exports.Http_GetContainerParents = Http_GetContainerParents;
function Http_AddItemsToPickList(items, crop, batch) {
    // Form the request string
    var apiPath = "picklist";
    if (crop) {
        apiPath += "?Batch_ID=true";
    }
    else if (batch) {
        apiPath += "?UID=true";
    }
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}
exports.Http_AddItemsToPickList = Http_AddItemsToPickList;
function Http_PostContainerStatuses(statuses) {
    var apiPath = "ContainerStatus";
    return Http_PostJson(apiPath, statuses, false);
}
exports.Http_PostContainerStatuses = Http_PostContainerStatuses;
function Http_DeleteItems(apiPath, ids) {
    if (ids.length > 0) {
        // Post the data using the Web API
        return (Http_DeleteJson(apiPath, ids));
    }
    else {
        // Handle error
        console.log("Delete items: no ids to delete");
        return Promise.reject("No items were selected for deletion.");
    }
}
exports.Http_DeleteItems = Http_DeleteItems;
function Http_DeleteItemsFromPickList(ids) {
    // Build the parameter string "picklist?id=[n1,n2,n3]"
    if (ids.length > 0) {
        var apiPath = "picklist";
        // Post the data using the Web API
        return (Http_DeleteJson(apiPath, ids));
    }
    else {
        // Handle error
        console.log("Delete items from picklist: no ids to delete");
        return Promise.reject("No items were selected in the Pick List.");
    }
}
exports.Http_DeleteItemsFromPickList = Http_DeleteItemsFromPickList;
// For Booking In/Out samples
function Http_EditStorage(apiPath, item) {
    // Post the data using the Web API
    return (Http_PutJson(apiPath, item));
}
exports.Http_EditStorage = Http_EditStorage;
function Http_EditItem(apiPath, id, item) {
    // Post the data using the Web API
    return (Http_PutJson(apiPath + "/" + id, item));
}
exports.Http_EditItem = Http_EditItem;
// Fetch material types (i.e. specific names)
function Http_GetContacts() {
    // Fetch the data using the Web API
    return (Http_GetJson('Sites'));
}
exports.Http_GetContacts = Http_GetContacts;
// Handle the import of data request
function Http_Import(formData) {
    if (formData && formData !== "") {
        // Post the data using the Web API
        return (Http_PostText("importRecords", formData));
    }
    else {
        // Handle the error
        console.log("Import: undefined or empty file: " + formData);
        return Promise.reject("A parameter error occurred while attempting to import the records.");
    }
}
exports.Http_Import = Http_Import;
// Handle the export data request
function Http_Export(startDate, endDate, crop) {
    if (crop === void 0) { crop = null; }
    var apiPath = "exportRecords?startDate=";
    if (startDate && endDate) {
        apiPath += startDate + "&endDate="; //[dd / mm / yyyy]
        apiPath += endDate; // [dd / mm / yyyy]
        if (crop) {
            apiPath += "&crop=" + crop; //[dd / mm / yyyy]
        }
        // Post the data using the Web API
        return (Http_GetTextBlob(apiPath));
    }
    else {
        // Handle the error
        console.log("Invalid init or end date in export");
        return Promise.reject("An invalid date range was submitted while exporting the records.");
    }
}
exports.Http_Export = Http_Export;
// Generic JSON GET handler
function Http_GetJson(apiPath) {
    if (apiPath) {
        // Get the data using the Web API
        return (httpClient.fetch(apiPath)
            .then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
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
                    console.log("Http_GetJson(): catch on response.json() promise - " + error);
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
                    console.log("Http_GetJson(): catch on response.json() success promise - " + error);
                    return Promise.reject(error);
                }));
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_GetJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_GetJson(): invalid apiPath");
        return Promise.reject("An invalid RESTful API path was submitted while getting the data.");
    }
}
// Generic JSON POST handler (items can be an object, array, etc.)
function Http_PostJson(apiPath, items, returnData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(apiPath && items)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (httpClient.fetch(apiPath, {
                            method: 'post',
                            body: aurelia_fetch_client_1.json(items)
                        }).then(function (response) {
                            if (!Http_requestSucceeded(response.status)) {
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
                                    console.log("Http_PostJson(): catch on response.json() promise - " + error);
                                    return Promise.reject(error);
                                }));
                            }
                            else {
                                // Success - now check if data is expected in the POST response
                                if (returnData) {
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
                                        console.log("Http_PostJson(): catch on response.json() success promise - " + error);
                                        return Promise.reject(error);
                                    }));
                                }
                                else {
                                    // Resolve the promise without data
                                    return Promise.resolve(undefined);
                                }
                            }
                        }).catch(function (error) {
                            // Error (caught from the next .then() scope)
                            console.log("Http_PostJson(): catch on response promise - " + error);
                            return Promise.reject(error);
                        }))];
                case 1: 
                // Get the data using the Web API
                return [2 /*return*/, _a.sent()];
                case 2:
                    // Handle the error
                    console.log("Http_PostJson(): invalid apiPath or items - " + apiPath + "; " + items);
                    return [2 /*return*/, Promise.reject("An invalid RESTful API path or items data was submitted.")];
            }
        });
    });
}
// Generic JSON PUT handler (items can be an object, array, etc.)
function Http_PutJson(apiPath, items) {
    if (apiPath && items) {
        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'put',
            body: aurelia_fetch_client_1.json(items)
        }).then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
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
                        return Promise.reject("An error occurred while processing the PUT operation.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Http_PutJson(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                // Success
                return Promise.resolve();
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_PutJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_PutJson(): invalid apiPath or items - " + apiPath + "; " + items);
        return Promise.reject("An invalid RESTful API path or items data was submitted.");
    }
}
// Generic JSON DELETE handler (items can be an object, array, etc.)
function Http_DeleteJson(apiPath, items) {
    if (apiPath && items) {
        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'delete',
            body: aurelia_fetch_client_1.json(items)
        }).then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
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
                        return Promise.reject("An error occurred while processing the DELETE operation.");
                    }
                }).catch(function (error) {
                    // Error (caught from the inner .then() scope)
                    console.log("Http_DeleteJson(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                // Success
                return Promise.resolve();
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_DeleteJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_DeleteJson(): invalid apiPath or items - " + apiPath + "; " + items);
        return Promise.reject("An invalid RESTful API path or items data was submitted.");
    }
}
// Generic text/csv blob GET handler
function Http_GetTextBlob(apiPath) {
    if (apiPath) {
        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'get',
            headers: {
                'Accept': 'text/csv'
            }
        }).then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
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
                    console.log("Http_GetTextBlob(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                // Success
                return response.blob();
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_GetTextBlob(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_GetTextBlob(): invalid apiPath");
        return Promise.reject("An invalid RESTful API path was submitted while getting the data.");
    }
}
// Generic text/csv blob POST handler
function Http_PostText(apiPath, text) {
    if (apiPath && text) {
        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'post',
            headers: {
                'Content-Type': 'text/csv'
            },
            body: text
        }).then(function (response) {
            if (!Http_requestSucceeded(response.status)) {
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
                    console.log("Http_PostText(): catch on response.json() promise - " + error);
                    return Promise.reject(error);
                }));
            }
            else {
                // Success
                return Promise.resolve();
            }
        }).catch(function (error) {
            // Error (caught from the next .then() scope)
            console.log("Http_PostText(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_PostText(): invalid apiPath or text - " + apiPath + "; " + text);
        return Promise.reject("An invalid RESTful API path or text data was submitted.");
    }
}
function Http_requestSucceeded(status) {
    // TODO JMJ these tests are quite loose at present
    // Assume for now that success is any response code in the 200s and 300s
    return (status && status >= 200 && status < 400);
}
//# sourceMappingURL=server.js.map