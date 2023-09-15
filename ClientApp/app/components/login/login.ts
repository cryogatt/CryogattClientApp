import { Aurelia, autoinject, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Resources } from '../resources';
import { AuthService } from '../auth/auth-service';
import * as toastr from 'toastr';

@autoinject()
export class Login {

    // Software version
    @bindable softwareVersion;

    // Login bindings
    @bindable userName: string;
    @bindable password: string;

    // Framework reference
    private aurelia: Aurelia;

    // Authorisation service
    private authService: AuthService;

    // Router for page navigation
    private router: Router;

    // Constructor
    constructor(aurelia: Aurelia, authService: AuthService, router: Router) {

        this.aurelia = aurelia;
        this.authService = authService;
        this.router = router;

        // Read the software version
        this.softwareVersion = Resources.cryogattWebVersion;
    }

    // Export a set of data records
    login() {

        // Test the user name and password
        if (this.userName && this.password) {

            // Authenticate and set up the session
            this.authService.login(this.userName, this.password)
                .then((): void => {

                    // Switch back to the default route
                    this.router.navigateToRoute('materials', {}, { replace: true });
                })
                .catch(error => {

                    // Error
                    toastr.error(error);
                });
        }
        else {

            // Error
            toastr.error('The user name and password cannot be empty.');
        }
    }
}
