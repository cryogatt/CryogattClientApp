import 'isomorphic-fetch';
import { Aurelia, PLATFORM, Container } from 'aurelia-framework';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { Http_Init, Http_UpdateToken, Http_GetSoftwareVersion } from './app/components/api/server';
import { Reader_Init } from './app/components/api/reader';
import { Server_ConvertToVersion } from './app/components/api/json-map';
import { AuthService } from './app/components/auth/auth-service';
import { Resources } from './app/components/resources';
// ReSharper disable once InconsistentNaming
declare const IS_DEV_BUILD: boolean; // The value is supplied by Webpack during the build

import * as toastr from 'toastr';

export function configure(aurelia: Aurelia) {
    aurelia.use.standardConfiguration();

    if (IS_DEV_BUILD) {
        aurelia.use.developmentLogging();
    }

    // Use of aurelia-dialog
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-dialog'));

    // Set the server API path
    if (IS_DEV_BUILD) {
        Resources.cryogattWebApiHost = Resources.cryogattDevHost;
    }
    else {
        // Get the calling hostname, as it is assumed that the API resides on the same server
        console.log("PROD BUILD");

     //   Resources.cryogattWebApiHost = Resources.cryogattDevHost; // TODO Change for release.

        Resources.cryogattWebApiHost = window.location.protocol + "//" + window.location.hostname + Resources.cryogattWebApiBase;
    }

    // Set up server interface
    Http_Init();

    // Set up RFID reader interface
    Resources.readerWebApiHost = window.location.protocol + "//" + Resources.readerWebApiHost + Resources.readerWebApiBase;
    Reader_Init();

    const authService: AuthService = Container.instance.get(AuthService);
    if (authService.isAuthenticated()) {

        // Refresh the Http interface with the token
        Http_UpdateToken(authService.getToken());
    }

    // Read the server version
    Resources.cryogattWebVersion = "Web v" + Resources.cryogattWebClientVersion + " / API ";
    Http_GetSoftwareVersion()
        .then(data => {

            var serverVersion = Server_ConvertToVersion(data);
            if (serverVersion) {

                // Update the overall software version
                Resources.cryogattWebVersion += "v" + serverVersion;
            }
            else {
                // Undefined server version
                Resources.cryogattWebVersion += "unknown";
            }

            // Navigate to the app
            aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app/components/app/app')));

        }).catch(error => {

            // An error has occurred, e.g. no data
            toastr.error(error);

            // Undefined server version
            Resources.cryogattWebVersion += "unknown";

            // Navigate to the app
            aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app/components/app/app')));
        });
}

