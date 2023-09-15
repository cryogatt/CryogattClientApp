import { GenericStorage } from '../../generic-storage';
import { ReaderService } from '../../../auth/reader-service';
import { ReaderType } from '../../../reader/reader-types';
import { BulkScannerStorageOperations } from '../../../reader/storage-operations/bulk-scanner-storage-operations';
import Server = require("../../../api/server");
import { Order } from "../../distribution/order";
import * as toastr from 'toastr';

export class StorageBulkScanShipperAgainestList {

  // Base list view model
  public storage: GenericStorage;

  public storageOperations: BulkScannerStorageOperations;


  // Constructor
  constructor(storage: GenericStorage) {

    this.storage = storage;

    // Initailise reader and start polling
    this.startReader();
  }

  async startReader() {

    // If there are items to be read        
    if (this.storage.items.length !== 0) {

      this.storageOperations = new BulkScannerStorageOperations(ReaderType.CRYOGATT_NR002);

      ReaderService.startPollingReader(await this.pollReader.bind(this));

      this.storage.subtitle = "Scan an incoming shipper to recieve shipment";
    } else {

      this.storage.canUseReader = false;
    }
  }

  // Main loop
  async pollReader() {

    if (!this.storage.canUpdateDb) {
      // Poll reader
      await this.storageOperations.scanForKnownItems();

      // If items found
      if (this.storageOperations.canUpdateDb) {
        // Require one item only
        if (this.storageOperations.foundItems.length === 1) {

          var item = await this.getCourier(this.storageOperations.foundItems[0].Uid);

          if (item) {

            let order: Order = this.getShippersOrder(item);

            if (order) {

              this.storage.subtitle = "Order " + order.consignment_no + " courier arrived: " + item.ShipperName;
              this.storage.canUpdateDb = true;

              // If selected item not on page navigate to it - workaround for selectedItem not set due to aurelia pagination issue
              if (!this.storage.selectedItem) {

                this.storage.selectedItem = this.storage.items.find(item => item.$isSelected);
                setTimeout(this.storage.navigateToSelected.bind(this.storage), 100);
              }
            }
          } else {

            this.storage.subtitle = "Item is not registered to any pending orders!";
          }
        } else {
          
          this.storage.subtitle = "More than one item detected!";         
        }
        this.reset();
      }
    }
  }

  // Get the courier record that the tag belongs to
  async getCourier(shipperUid: string):Promise<any> {

    return Server.Http_GetItems("Shipping" + "/" + shipperUid).then(data => {

      if (data && data.hasOwnProperty('Couriers')) {

        if (data.Couriers.length === 1) {

          return data.Couriers[0];
        } else if (data.Couriers.length === 0) {

          return null;
        } else if (data.Couriers.length > 1) {

          toastr.error("Shipper belongs to more than one shipment!");
        }
        return data;
      } else {

        return null;
      }
    }).catch(error => {

      toastr.error(error);
    });
  }

  // Get the order that the shipper belongs to
  getShippersOrder(item): Order {

    let order = this.storage.items.find(order => order.uid === item.ShipmentId);

    if (order) {

      order.$isSelected = true;
    }
    return order;
  }

  reset() {

    this.storageOperations.clear();
    this.storageOperations.foundItems = [];
    this.storageOperations.canUpdateDb = false;
  }
}
