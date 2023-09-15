import { transient, bindable, bindingMode } from 'aurelia-framework';
import { StorageModalMode } from '../storage-modal-mode';

// Generic features of a user
@transient()
export class User {

    // User bindings
    @bindable uid: string;

    // Basic info
    @bindable({ defaultBindingMode: bindingMode.twoWay }) userName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) firstName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) lastName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) email: string;

    // Statistics
  //  @bindable({ defaultBindingMode: bindingMode.twoWay }) lastLogin: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) addedDate: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) updatedDate: string;

    // Other properties
    @bindable({ defaultBindingMode: bindingMode.twoWay }) isAdministrator: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) password: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) confirmPassword: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) site: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) group: string;

    // Data-level input validation for the form
    validate(mode: StorageModalMode): Promise<any> {

      // Check username has been entered and is a suitable length
      if (!this.userName) {

        return Promise.reject('Username required!');
      } else if (this.userName.length > 50 || this.userName.length < 5) {

        return Promise.reject('Username must be between 5 and 50 characters!');
      }

      // Ensure first name has been entered and is a suitable length
      if (!this.firstName) {

        return Promise.reject('First name required!');
      } else if (this.userName.length > 50) {

        return Promise.reject('first name must be no longer than 50 characters!');
      }

      // Ensure last name has been entered and is a suitable length
      if (!this.lastName) {

        return Promise.reject('Last name required!');
      } else if (this.userName.length > 50) {

        return Promise.reject('Last name must be no longer than 50 characters!');
      }

      // Ensure email has been entered and is a suitable length
      if (!this.email) {

        return Promise.reject('Email required!');
      } else if (this.email.length > 50) {

        return Promise.reject('Email must be no longer than 50 characters!');
      }

      // Ensure site has been selected
      if (!this.site) {

        return Promise.reject('Site required!');
      } 

      // Ensure password has been entered and is a suitable length
      if (!this.password) {

        return Promise.reject('Password required!');
      } else if (this.password.length > 50 || this.password.length < 5) {

        return Promise.reject('Password must be between 5 and 50 characters!');
      }

      // Check for password-related errors
      if (this.password !== this.confirmPassword || (mode === StorageModalMode.CREATE && !this.password)) {

          // The passwords should always match
          return Promise.reject('The password must match the confirmation password, and must not be empty.');
      } else {

          // Success
          return Promise.resolve();
      }
    }
}



