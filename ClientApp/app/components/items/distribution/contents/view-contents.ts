import { useView } from 'aurelia-framework';
import { Server_ConvertToContents, Server_ConvertToSingleOrder } from '../../../api/json-map';
import { GenericStorage } from '../../generic-storage'
import { Contents } from './Contents'
import { ReaderService } from '../../../auth/reader-service';
import { Order } from '../Order';
import { Http_GetItems, Http_EditStorage } from '../../../api/server';
import * as toastr from 'toastr';
import { autoinject } from 'aurelia-dependency-injection';
import { StorageBulkScanAgainestList } from "../../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list";

@useView('../../generic-storage.html')
@autoinject()
export class ViewContents {

    // Base list view model
    public storage: GenericStorage;
    public scanOperation: any;
    public contents: Contents;

    // Order record that the contents belongs to
    public order: Order;
  
    // Constructor
    constructor(storage: GenericStorage, contents: Contents) {

        this.storage = storage;
        this.contents = contents;
    }

    // Sets up the specific bindings for contents
    async activate(routeParams) {

        // Parse the shipment id from the parameter
        var shipmentId = this.getShipmentId(routeParams);

        if (shipmentId) {

          await this.getOrder(shipmentId);
        }

        // General properties
        this.storage.storageType = 'contents';
        this.storage.type_singular = "Content";
        this.storage.type_plural = "Contents";
        this.storage.apiPath = "Contents/" + shipmentId;

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("primary_description", "Labelled");
        this.storage.schema.set("Batch", "Batch Name",);
        this.storage.schema.set("parent_description", "Now Stored In");
        this.storage.schema.set("gParent_description", ".");
        this.storage.schema.set("ggParent_description", "..");
        
        // Command presence
        this.storage.canViewHistory = true;
        this.storage.canDeleteItem = true;
        // Default to true setDisplay() re-evaluates if order has been finished and sets the variable accordingly
        this.storage.canUseReader = true;

        // Fetch the data using the Web API
        await this.storage.fetch(this.storage.apiPath + "?status=SHIPMENT", Server_ConvertToContents);
        // Set the operation depending on the status of the order
        this.setOperation();
    }

    // Upon leaving the page
    async deactivate() {

        if (ReaderService.readerOn) {
          
           await ReaderService.stopPollingReader();
        }
    }

    // Reset internal settings & table data
    reset() {

        this.scanOperation.reset();

        this.storage.fetch(this.storage.apiPath + "?status=SHIPMENT", Server_ConvertToContents);

        this.storage.subtitle = "";
    }

    // TODO remove hardcoded strings for status
    setOperation() {

        this.storage.title = this.order ? this.order.sender + " - " + this.order.recipient : "Order Unknown!";
      
        // If items are on the list
        if (this.storage.items && this.storage.items.length !== 0) {

            var newParentItems, requiredItems = [];
            if (this.order.status === "Awaiting-Dispatch") {

              this.storage.subtitle = "Scan items to prepare shipment";
              this.storage.selectMultiple = true;
              Contents.canDispatchShipment = true;

              // Set storage operation variables
              requiredItems = ["Dewar", "Canister", "Cane", "Sample", "Dry Shipper"];
              newParentItems = ["Dry Shipper"];
            } else if (this.order.status === "In-Transit") {

              this.storage.subtitle = "Scan items to receive shipment";
              this.storage.selectMultiple = true;
              Contents.canDispatchShipment = false;

              // Set required items to be read in different order
              requiredItems = ["Sample", "Cane", "Dry Shipper"];
              newParentItems = [];
            } else if (this.order.status === "Received") {

              this.storage.selectMultiple = false;
              this.storage.canViewHistory = true;
              this.storage.canUseReader = false;
            }

            if (this.storage.canUseReader) {
              // If connected to reader service
              ReaderService.isConnected().then(resp => {

                if (resp) {

                  this.scanOperation = new StorageBulkScanAgainestList(this.storage, requiredItems, newParentItems);
                }
              });
            }
        }
    }
  
    public async confirm() {

        const items = this.scanOperation.filterSelectedItems();

        // UPDATE DB
        var parameter: string = Contents.canDispatchShipment ? "SEND" : "RECEIVE";
        await Http_EditStorage("Shipping/" + this.order.uid + "?" + parameter, items).then((): void => {

            // TODO ADD UPDATE STATUS METHOD.

            var message: string = Contents.canDispatchShipment ? "dispatched" : "received";
            // Inform the user of the success
            toastr.success("Items have been " + message);
            this.storage.subtitle = "Items have been " + message;
        }).catch(error => {

            // Inform the user of the error
            toastr.error("An error occurred and the database was not successfully updated. " , error);
        });

        this.scanOperation.reset();

        // Clear selected items from list
        this.storage.items = this.storage.items.filter(selectedItem => !selectedItem.$isSelected);

        if (this.storage.items.length === 0) {

            this.scanOperation.reset();
            await ReaderService.stopPollingReader();
        }

        //this.reset();
        //await ReaderService.stopPollingReader();
    }

    getShipmentId(routeParams) {

      // Parse the shipment id from the parameter
      if (routeParams && routeParams.item) {
        var paramParts: string[] = routeParams.item.split('%0B');
        if (paramParts.length >= 3) {

          return paramParts[1];
        }
      }
      return undefined;
    }

    async getOrder(shipmentId: string) {

        // Fetch the data using the Web API 
        await Http_GetItems("Orders" + "/" + shipmentId)
            .then(data => {

                var order = Server_ConvertToSingleOrder(data);

                if (order) {

                    // Store the result locally
                    this.order = order;
                }
                else {

                    // Undefined items list
                    toastr.error("An error occurred, the order could not be found.");
                }
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
            });
    }

    // Delete one or more items from the list
    delete() {

      // Hand off to the generic object
      this.storage.delete(Server_ConvertToContents, "?status=SHIPMENT");
    }
}
