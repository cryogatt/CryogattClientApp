import { HttpClient, json } from 'aurelia-fetch-client';
import { AuthService } from '../auth/auth-service';
import { Resources } from "../resources";
import { Inventory } from "../reader/data-structures/inventory";
import { ContainerStatus } from '../items/history/ContainerStatus';

var httpClient = new HttpClient();
var $ = require('jquery');

export function Http_Init() {

    // Configure the client
    httpClient.configure(config => {
        config
            .withBaseUrl(Resources.cryogattWebApiHost)
            .withDefaults({
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'Fetch'
                }
            })
            .withInterceptor({
                request(request) {
                    console.log(`Requesting ${request.method} ${request.url}`);
                    return request;
                },
                response(response) {
                    console.log(`Received ${response.status} ${response.url}`);
                    return response;
                }
            });
    });
}

export function Http_UpdateToken(token: string) {

    if (token && token !== "") {

        // Configure the client with the token
        httpClient.configure(config => {
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
        httpClient.configure(config => {
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

// Authenticate with the server
export function Http_Authenticate(username: string, password: string): Promise<any> {

    if (username && password) {

        // Get the data using the Web API
        return (httpClient.fetch('users/tokens', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: $.param({ username: username, password: password, grant_type: "password" })
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_Authenticate(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return ((response.json() as Promise<any>)
                    .then(data => {

                        if (data) {

                            // Successful parse of the JSON
                            return Promise.resolve(data);
                        }
                        else {
                            // Error during JSON parse
                            console.log(data);
                            return Promise.reject("An error occured while parsing the returned data.");
                        }

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_Authenticate(): catch on response.json() success promise - " + error);
                        return Promise.reject(error);
                    }));
            }
        }).catch(error => {

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

// Fetch container types (i.e. specific idents) for a given level - default to root
export function Http_GetContainerGeneralTypes(level?): Promise<any> {

    let apiPath = 'ContainerIdents';

    if (level) {

      apiPath += "?LEVEL=" + level;
    }
    // Fetch the data using the Web API
    return (Http_GetJson(apiPath));
}


// Fetch container types (i.e. specific idents)
export function Http_GetContainerSpecificTypes(type: number): Promise<any> {

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

// Fetch container contents level (i.e. primary container)
export function Http_GetContainerContentsLevel(uid: string): Promise<any> {

    // Fetch the data using the Web API
    return (Http_GetJson('ContainerLevel' + '/' + uid));
}

// Fetch tag ident type description from server
export function Http_GetTagIdentTypeDesc(tagIdent: string): Promise<any> {

  // Fetch the data using the Web API
  return (Http_GetJson("BookingOperations" + "/" + parseInt(tagIdent, 16)));
}

// Fetch the primary container records for a given parent
export function Http_GetParentPrimaryContainers(parentUid: string): Promise<any> {

  // Fetch the data using the Web API
  return (Http_GetJson("PrimaryContainers" + "/" + parentUid));
}

// Fetch either containers / materials / history / picklist, i.e. any list
export function Http_GetItems(apiPath: string): Promise<any> {

    // Fetch the data using the Web API 
    return (Http_GetJson(apiPath));
}

// Fetch either containers / materials / history / picklist, i.e. any list
export function Http_GetBatchItems(type: number, id: string): Promise<any> {

    var apiPath: string = "batches";
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

// Fetch Orders
export function Http_GetOrder(id: number): Promise<any> {

    // Fetch the data using the Web API 
    return (Http_GetJson('Orders' + '/' + id));
}

// Fetch Orders
export function Http_GetListOfOrders(Status: string): Promise<any> {

    // Fetch the data using the Web API 
    return (Http_GetJson('Orders' + '?' + Status));
}

// Fetch material
export function Http_GetMaterial(id: string): Promise<any> {

    // Fetch the data using the Web API 
    return (Http_GetJson('materials' + '/' + id));
}

// Fetch user
export function Http_GetUser(id: string): Promise<any> {

    // Fetch the data using the Web API 
    return (Http_GetJson('users' + '/' + id));
}

// Fetch software version
export function Http_GetSoftwareVersion(): Promise<any> {

    // Fetch the server software version using the Web API 
    return (Http_GetJson('version'));
}

export function Http_AddItem(apiPath: string, item): Promise<any> {

    // Post the data using the Web API
    return (Http_PostJson(apiPath, item, true));
}

export function Http_AddItems(apiPath: string, items: any[]): Promise<any> {

    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}

export function Http_AddItemsToShipment(items: any[], apiPath: string): Promise<any> {
    
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}

export async function Http_AuditItem(items: any[]): Promise<any> {

    // Post the data using the Web API
    return await (Http_PostJson("History/" + items, items, false));
}

export async function Http_AuditPrimaryContainers(items: any[]): Promise<any> {

  // Post the data using the Web API
  return await (Http_PostJson("History", items, false));
}

export function Http_GetTagResponse(apiPath: string, items: any[]): Promise<any> {

    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, true));
}

// Get the identity of a single tags
export function Http_GetSingleTagIdentity(tagUid: string): Promise<any> {

  var apiPath = 'BookingOperations?UIDS=' + tagUid;

  // Post the data using the Web API
  return (Http_GetJson(apiPath).then(data => {

    return data;
  }));
}
// Get the identity of many tags
export function Http_PostTagsIdentity(items: Inventory[]): Promise<any> {

  var apiPath = "RFID";
  var uids: string[] = [];
  items.forEach(tag => uids.push(tag.UID[0]));

  // Post the data using the Web API
  return (Http_PostJson(apiPath, uids, true));
}
// Get the identity of many tags
export function Http_GetTagsIdentity(items: Inventory[]): Promise<any> {

  var apiPath = 'BookingOperations?';
  for (var i: number = 0; i < items.length; i++) {

    for (var j: number = 0; j < items[i].UID.length; j++) {

      // Append on new addition apart from first
      if (!(i === 0 && j === 0)) {

        apiPath += "&";
      }
      apiPath += "UIDS=" + items[i].UID[j];
    }
  }

  // Post the data using the Web API
  return (Http_GetJson(apiPath).then(data => {

    return data;
  }));
}

export function Http_GetTagIdentity(apiPath: string): Promise<any> {

    // Post the data using the Web API
    return (Http_GetJson(apiPath));
}

export function Http_GetContainerParents(apiPath:string, id: string) {

    // Fetch the server software version using the Web API 
    return (Http_GetJson('ContainerParent' + '/' + id));
}

export function Http_AddItemsToPickList(items: any[], crop: boolean, batch: boolean): Promise<any> {

    // Form the request string
    var apiPath: string = "picklist";
    if (crop) {
        apiPath += "?Batch_ID=true";
    }
    else if (batch) {
        apiPath += "?UID=true";
    }
    
    // Post the data using the Web API
    return (Http_PostJson(apiPath, items, false));
}

export function Http_PostContainerStatuses(statuses: ContainerStatus[]): Promise<any> {

    var apiPath: string = "ContainerStatus";

    return Http_PostJson(apiPath, statuses, false);
}

export function Http_DeleteItems(apiPath: string, ids: string[]): Promise<any> {

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

export function Http_DeleteItemsFromPickList(ids: string[]): Promise<any> {

    // Build the parameter string "picklist?id=[n1,n2,n3]"
    if (ids.length > 0) {
        var apiPath: string = "picklist";

        // Post the data using the Web API
        return (Http_DeleteJson(apiPath, ids));
    }
    else {
        // Handle error
        console.log("Delete items from picklist: no ids to delete");
        return Promise.reject("No items were selected in the Pick List.");
    }
}

// For Booking In/Out samples
export function Http_EditStorage(apiPath: string, item): Promise<any> {

    // Post the data using the Web API
    return (Http_PutJson(apiPath, item));
}

export function Http_EditItem(apiPath: string, id: string, item): Promise<any> {

    // Post the data using the Web API
    return (Http_PutJson(apiPath + "/" + id, item));
}

// Fetch material types (i.e. specific names)
export function Http_GetContacts(): Promise<any> {

    // Fetch the data using the Web API
    return (Http_GetJson('Sites'));
}

// Handle the import of data request
export function Http_Import(formData: string): Promise<any> {

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

// Handle the export data request
export function Http_Export(startDate: string, endDate: string, crop: string=null): Promise<any> {

    var apiPath: string = "exportRecords?startDate=";

    if (startDate && endDate) {
        apiPath += startDate + "&endDate="; //[dd / mm / yyyy]
        apiPath += endDate // [dd / mm / yyyy]

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

// Generic JSON GET handler
function Http_GetJson(apiPath: string): Promise<any> {

    if (apiPath) {

        // Get the data using the Web API
        return (httpClient.fetch(apiPath)
            .then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_GetJson(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return ((response.json() as Promise<any[]>)
                    .then(data => {

                        if (data) {
                            // Successful parse of the JSON
                            return Promise.resolve(data);
                        }
                        else {
                            // Error during JSON parse
                            console.log(data);
                            return Promise.reject("An error occured while parsing the returned data.");
                        }

                    }).catch(error => {

                            // Error (caught from the inner .then() scope)
                            console.log("Http_GetJson(): catch on response.json() success promise - " + error);
                            return Promise.reject(error);
                    }));
            }
        }).catch(error => {

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
async function Http_PostJson(apiPath: string, items, returnData: boolean): Promise<any> {

    if (apiPath && items) {

        // Get the data using the Web API
        return await (httpClient.fetch(apiPath, {
            method: 'post',
            body: json(items)
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_PostJson(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success - now check if data is expected in the POST response
                if (returnData) {

                    return ((response.json() as Promise<any[]>)
                        .then(data => {

                            if (data) {
                                // Successful parse of the JSON
                                return Promise.resolve(data);
                            }
                            else {
                                // Error during JSON parse
                                console.log(data);
                                return Promise.reject("An error occured while parsing the returned data.");
                            }

                        }).catch(error => {

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
        }).catch(error => {

            // Error (caught from the next .then() scope)
            console.log("Http_PostJson(): catch on response promise - " + error);
            return Promise.reject(error);
        }));
    }
    else {
        // Handle the error
        console.log("Http_PostJson(): invalid apiPath or items - " + apiPath + "; " + items);
        return Promise.reject("An invalid RESTful API path or items data was submitted.");
    }
}

// Generic JSON PUT handler (items can be an object, array, etc.)
function Http_PutJson(apiPath: string, items): Promise<any> {

    if (apiPath && items) {

        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'put',
            body: json(items)
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_PutJson(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return Promise.resolve();
            }
        }).catch(error => {

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
function Http_DeleteJson(apiPath: string, items): Promise<any> {

    if (apiPath && items) {

        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'delete',
            body: json(items)
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_DeleteJson(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return Promise.resolve();
            }
        }).catch(error => {

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
function Http_GetTextBlob(apiPath: string): Promise<any> {

    if (apiPath) {

        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'get',
            headers: {
                'Accept': 'text/csv'
            }
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_GetTextBlob(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return (response.blob() as Promise<Blob>);
            }
        }).catch(error => {

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
function Http_PostText(apiPath: string, text: string): Promise<any> {

    if (apiPath && text) {

        // Get the data using the Web API
        return (httpClient.fetch(apiPath, {
            method: 'post',
            headers: {
                'Content-Type': 'text/csv'
            },
            body: text
        }).then(response => {
            if (!Http_requestSucceeded(response.status)) {

                // Obtain the error message from the JSON
                return ((response.json() as Promise<any>)
                    .then(data => {

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

                    }).catch(error => {

                        // Error (caught from the inner .then() scope)
                        console.log("Http_PostText(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

                // Success
                return Promise.resolve();
            }
        }).catch(error => {

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

function Http_requestSucceeded(status: number): boolean {

    // TODO JMJ these tests are quite loose at present
    // Assume for now that success is any response code in the 200s and 300s
    return (status && status >= 200 && status < 400);
}

