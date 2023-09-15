import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { Http_GetOrder, Http_GetContacts } from '../../api/server';
import { Server_ConvertToOrderExtended } from '../../api/json-map';
import { Order } from './order';
import { StorageModalMode } from '../storage-modal-mode';

var $ = require('jquery');
import * as toastr from 'toastr';

// Generic features of a storage material
@transient()
@autoinject()
export class StorageOrder {

    // Order bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) order: Order;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) mode: StorageModalMode;
    @bindable contacts: string[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) ordered_date: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) dispatched_date: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) arrived_date: Date;


    bind() {

        // Fetch the Contacts
        Http_GetContacts()
            .then(data => {

                // Store the result locally
                this.contacts = data;
                
                if (this.mode !== StorageModalMode.CREATE) {

                    // Fetch the order using the Web API 
                    Http_GetOrder(this.order.uid)
                        .then(data => {

                            var item = Server_ConvertToOrderExtended(data);
                            if (item) {

                                // Store the result locally
                                this.order = item;

                               // Bind the dates
                                this.ordered_date = (this.order.ordered_date !== null) ? this.order.ordered_date : undefined;
                                this.dispatched_date = (this.order.dispatched_date !== null) ? this.order.dispatched_date : undefined;
                                this.arrived_date = (this.order.arrived_date !== null) ? this.order.arrived_date : undefined;
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
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
                this.contacts = [];
            });
    }
}