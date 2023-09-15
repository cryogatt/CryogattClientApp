import { Aurelia, autoinject, PLATFORM, Container } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Http_Authenticate, Http_UpdateToken } from '../api/server';

@autoinject()
export class AuthService {

    // Aurelia framework
    private aurelia: Aurelia;
    private bindingSignaler: BindingSignaler;

    // Session token
    private session;

    constructor(aurelia: Aurelia, bindingSignaler: BindingSignaler) {

        this.aurelia = aurelia;
        this.bindingSignaler = bindingSignaler;

        // Retrieve any existing session from localStorage
        this.session = JSON.parse(localStorage.getItem('token') || null);
    }

    // Handle login request
    login(username: string, password: string): Promise<any> {

        return (Http_Authenticate(username, password)
            .then(session => {

                // Store the session information
                localStorage.setItem('token', JSON.stringify(session));
                this.session = session;

                // Notify listeners
                this.bindingSignaler.signal('signal-authentication-changed');

                // Update the HTTP client to include the token
                Http_UpdateToken(session.access_token);

            }).catch(error => {

                // Error
                return Promise.reject(error);
            }));
    }

    // Handle logout request
    logout() {

        // Clear out the session and update the signal state
        this.endSession();

        // Switch back to the login shell
        var router: Router = Container.instance.get(Router);
        router.navigateToRoute('login');
    }

    // Reset the session state
    endSession() {

        // Clear out the session information
        localStorage.setItem('token', null);
        this.session = null;

        // Notify listeners
        this.bindingSignaler.signal('signal-authentication-changed');

        // Update the HTTP client to include the cleared token
        Http_UpdateToken(null);
    }

    // Retrieve the token
    getToken(): string {

        return (this.session.access_token);
    }

    // Retrieve the current username
    getCurrentUser(): string {

        // Check role information in token
        if (this.session && this.session !== null && this.session !== "") {

            var token = this.parseToken();
            if (token && token.hasOwnProperty('unique_name')) {
                return token.unique_name;
            }
        }

        return ("");
    }

    // Allow other modules to check whether the user is authenticated  
    isAuthenticated(): boolean {

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
    }

    // Allow other modules to check whether the user is authorised for a particular function
    isAuthorised(): boolean {

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
    }

    // Decodes the message part of the token and returns it as a JSON structure
    parseToken(): any {

        var token = null;
        if (this.session) {

            // This try/catch is important here, because if this code fails during page load/refresh, the uncaught exception causes
            // the page to hang, displaying only "Loading...". At the time I worked this out, only Chrome (61) reported the unexception
            // whereas Firefox (56) failed silently.
            try {
                // If the token format is valid it should be <header>.<message>
                var parts: string[] = this.session.access_token.split('.');
                if (parts && parts.length > 1) {

                    // Base64 decode the <message> part, and extract the JSON
                    token = JSON.parse(atob(parts[1]));
                }
            } catch (e) {

                // Error
                console.log("AuthService.isAuthorised(): failed to parse access_token");
            }
        }

        return token;
    }
}

