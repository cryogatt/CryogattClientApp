import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { Http_GetUser, Http_GetContacts } from '../../api/server';
import { Server_ConvertToUser } from '../../api/json-map';
import { User } from './user';
import { StorageModalMode } from '../storage-modal-mode';

var $ = require('jquery');
import * as toastr from 'toastr';

// Generic features of a storage user
@transient()
@autoinject()
export class StorageUser {

    // User bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) user: User;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) mode: StorageModalMode;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) confirmPassword: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) isAdministrator: boolean;
    @bindable sites: string[];

    bind() {

        // Fetch the Contacts
        Http_GetContacts()
            .then(data => {

                // Store the result locally
                this.sites = data;

                if (this.mode !== StorageModalMode.CREATE) {

                    // Fetch the user using the Web API 
                    Http_GetUser(this.user.uid)
                        .then(data => {

                            var item = Server_ConvertToUser(data);
                            if (item) {

                                // Store the result locally
                                this.user = item;

                                // Bind the additional fields
                                this.isAdministrator = this.user.isAdministrator;
                            }
                            else {

                                // Undefined item error
                                toastr.error("An error occurred, and the record could only be part-retrieved.");
                            }
                        }).catch(error => {

                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        });
                }
                else {

                    this.isAdministrator = this.user.isAdministrator;
                }
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
                this.sites = [];
            });
    }


}