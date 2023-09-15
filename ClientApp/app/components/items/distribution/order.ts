import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of a picklist item
@transient()
export class Order {

    @bindable uid: number;
    // Order bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) sender: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) recipient: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) consignment_no: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) notes: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) sample_qty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) status: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) ordered_date: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) dispatched_date: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) arrived_date: Date;

    validate(): Promise<any> {

        // Ensure sender has been selected
        if (!this.sender) {

          return Promise.reject('Sender required!');
        }

      // Ensure recipient has been selected
      if (!this.recipient) {

        return Promise.reject('Recipient required!');
      }

      // Check sender does not equal recipient
      if (this.sender === this.recipient) {

        return Promise.reject('The sender and recipient cannot be the same!');
      }

      // Ensure Consignment has been entered and is a valid length
      if (!this.consignment_no) {

        return Promise.reject('Consignment required!');
      } else if (this.consignment_no.length > 50) {

        return Promise.reject('Consignment must be no longer than 50 characters!');
      }
      return Promise.resolve();
    }
}