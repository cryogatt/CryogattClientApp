// Resources for the project, accessible from TypeScript
export namespace Resources {

    // Server API host name and path
    export var cryogattWebApiHost: string = "";
    export const cryogattWebApiBase: string = ':44390/api/v1/';
  //  export const cryogattWebApiBase: string = 'api/v1/';

    // Development server
    export const cryogattDevHost: string = 'https://localhost:44390/api/v1/';
   // export const cryogattDevHost: string = 'https://testserverapi20191102052813.azurewebsites.net/api/v1/';

    // Software versioning
    export var cryogattWebVersion: string = "";
    export const cryogattWebClientVersion: string = "1.0";

    // RFID Reader API hostname and path
    export var readerWebApiHost: string = 'localhost';
    export const readerWebApiBase: string = ':44301/api/v2/';

    // Box row and column counts - for now, this appears to be fixed
    export const boxRowCount: number = 10;
    export const boxColumnCount: number = 10;
}
