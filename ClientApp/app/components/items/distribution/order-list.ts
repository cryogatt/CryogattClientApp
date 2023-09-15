import { useView, inject } from 'aurelia-framework';
import { Server_ConvertToOrder, Server_ConvertFromOrder } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';
import { Orders } from './Orders';
import { ReaderService } from '../../auth/reader-service';
import { Http_GetItems } from '../../api/server';
import * as toastr from 'toastr';
import Storagebulkscanshipperagainestlist =
require("../storage-reader-operations/scan-againest-list/storage-bulk-scan-shipper-againest-list");
import StorageBulkScanShipperAgainestList = Storagebulkscanshipperagainestlist.StorageBulkScanShipperAgainestList;

@useView('../generic-storage.html')
@inject(GenericStorage, Orders)
export class OrderList {

    private stop: boolean = true;

    // Base list view model
    public storage: GenericStorage;
    public orders: Orders;
    public param: string;

    public scanOperation: any;

    public requiredItems: any[];

    // Constructor
    constructor(storage: GenericStorage, orders: Orders) {
        this.storage = storage;
        this.orders = orders;
        this.param = "";
    }

    // Sets up the specific bindings 
    async bind() {
        // General storage properties
        this.storage.storageType = 'order';
        this.storage.type_singular = "Order";
        this.storage.type_plural = "Orders";
        this.storage.title = this.storage.type_plural;
        this.storage.apiPath = "Orders";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("consignment_no", "Consignment");
        this.storage.schema.set("sender", "Sender");
        this.storage.schema.set("recipient", "Recipient");
        this.storage.schema.set("sample_qty", "Sample Qty");
        this.storage.schema.set("status", "Status");
      
        // Command bindings
        this.storage.canCreateItem = true;
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        this.storage.canUpdatePickList = false;
        this.storage.canDeleteItem = false;
        this.storage.canUseReader = true;
        this.orders.canViewInbound = true;
        this.orders.canViewOutbound = true;
        this.orders.canViewContents = true;
        this.orders.canAddContentsButton = true;

        this.storage.commandBtnTxt = "Goods In";
        
        // Fetch the data using the Web API
        this.storage.items = Server_ConvertToOrder(await Http_GetItems(this.storage.apiPath + this.param));
        this.param = "";

        // If connected to reader service
        ReaderService.isConnected().then(resp => {

          if (resp) {

            if (this.storage.items && this.storage.items.length !== 0) {
              // If any shippers are in transit
              if (this.storage.items.some(order => order.status === "In-Transit")) {

                this.scanOperation = new StorageBulkScanShipperAgainestList(this.storage);
              }
            }
          }
        });
    }

    // Upon leaving the page
    async unbind() {

      if (ReaderService.readerOn()) {

        await ReaderService.stopPollingReader();
      }
    }

    inboundFilter() {
        
        this.param = "?STATUS=INBOUND";
        this.bind();
    }

    outboundFilter() {

        this.param = "?STATUS=OUTBOUND";
        this.bind();
    }

    nonFilter() {
        this.param = "";
        this.bind();
    }

    create() {

        // Hand off to the generic object
        this.storage.create(this.orders.getNew());
    }

    view() {

        this.storage.view(this.orders.getSelected(this.storage.selectedItem));
    }

    edit() {

        // Hand off to the generic object
        this.storage.edit(this.orders.getSelected(this.storage.selectedItem));
    }
}