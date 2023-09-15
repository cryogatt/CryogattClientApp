import { transient, bindable, bindingMode, autoinject } from 'aurelia-framework';

// Generic features of a container
@transient()
@autoinject()
export class Container {

    // Container bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) name: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) type: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) addedDate: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containsQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containsType: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) tagIdent: number;
  
    // Input validation for the form
    validate(): Promise<any> {

      // Check name has been entered and is a suitable length
      if (!this.name) {

        return Promise.reject('Name required!');
      } else if (this.name.length > 50) {

        return Promise.reject('Name must be no longer than 50 characters!');
      } else if (this.name.indexOf('$') !== -1) {

        return Promise.reject('Name cannot contain character: $');
      }

      // Check either type when entering non RFID enabled container has been given or tagIdent when reading tagged items
      if (!this.type && !this.tagIdent) {

        return Promise.reject('Type required!');
      } 

      if (this.containsQty < 0) {

        return Promise.reject( this.name + ' cannot contain less than 0 items!');
      }
      // Success
      return Promise.resolve();
    }
}