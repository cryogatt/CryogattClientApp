import { HttpClient, json } from 'aurelia-fetch-client';
import { AuthService } from '../auth/auth-service';
import { Resources } from "../resources";
import { ReaderType } from '../reader/reader-types';
import { GetReader_InventoryPath, GetReader_IdentPath } from './reader-api-path-broker';

var readerClient = new HttpClient();
var $ = require('jquery');

export function Reader_Init() {

    // Configure the client
    readerClient.configure(config => {
        config
            .withBaseUrl(Resources.readerWebApiHost)
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

// List all readers
export function Reader_ListAll(): Promise<any> {

    // List all configured readers
    return (Reader_GetJson('readers'));
}

// Read specific reader
export function Reader_Read(readerId: string): Promise<any> {

    if (readerId !== ReaderType.CRYOGATT_R10102.toString())
        return (Reader_GetJson('readers/' + readerId));

    return new Promise<any>(resolve =>
        resolve({
            Id: 5,
            AntennaQuantity: 100,
            Name: "Cryogatt 10* 10 Vial Reader P/N R10102",
            TagsPerAntenna: 1,
            URL: ""
        })
    );
}

// Perform ISO 15693 Inventory
export function Reader_Inventory(readerId: string): Promise<any> {

    var apiPath = GetReader_InventoryPath(readerId);
    
    // Fetch the data using the RFID Reader Web API
    return (Reader_GetJson(apiPath));
}

// Perform ISO 15693 Block 0 (Ident)
export function Reader_Ident(readerId: string, tagId: string, antennaNo?: number): Promise<any> {

    var apiPath = GetReader_IdentPath(readerId, tagId, antennaNo);

    return Reader_GetJson(apiPath);
}

// Fetch software version
export function Reader_GetSoftwareVersion(): Promise<any> {

    // Fetch the server software version using the Web API 
    return (Reader_GetJson('version'));
}

// Try to fetch the service version to test the connection
export function Reader_CanConnect(): Promise<boolean> {

  return (readerClient.fetch('version')
    .then(response => {

      if (response) {

        return true;
      } else {

        return false;
      }
    }).catch(error => {

      console.log(error);
      return false;
    }));
}

export function Reader_GetTemp(readerId: number, probeId: number = 0): Promise<any> {

    return Reader_GetJson('Cold10102Reader/GetTemp/' + probeId);
}

export function Reader_GetBatteryLife(readerId: number): Promise<any> {

    return Reader_GetJson('Cold10102Reader/GetBatteryLife');
}

// Generic JSON GET handler
function Reader_GetJson(apiPath: string): Promise<any> {

    if (apiPath) {

        // Get the data using the RFID Reader Web API
        return (readerClient.fetch(apiPath)
            .then(response => {
                if (!Reader_requestSucceeded(response.status)) {

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
                            console.log("Reader_GetJson(): catch on response.json() promise - " + error);
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
                            console.log("Reader_GetJson(): catch on response.json() success promise - " + error);
                            return Promise.reject(error);
                        }));
                }
            }).catch(error => {

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
function Reader_PostJson(apiPath: string): Promise<any> {

    if (apiPath) {

        // Post the data using the RFID Reader Web API
        return (readerClient.fetch(apiPath, {
            method: 'post'
        }).then(response => {
            if (!Reader_requestSucceeded(response.status)) {

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
                        console.log("Reader_PostJson(): catch on response.json() promise - " + error);
                        return Promise.reject(error);
                    }));
            }
            else {

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
                        console.log("Reader_PostJson(): catch on response.json() success promise - " + error);
                        return Promise.reject(error);
                    }));
            }
        }).catch(error => {

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

function Reader_requestSucceeded(status: number): boolean {

    // Assume for now that success is always response code 200
    return (status && status == 200);
}
