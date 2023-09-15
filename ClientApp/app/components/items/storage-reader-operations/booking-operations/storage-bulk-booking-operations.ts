import {  useView, autoinject } from 'aurelia-framework';
import { GenericStorage } from '../../generic-storage';
import { Http_EditStorage, Http_PostContainerStatuses } from '../../../api/server';
import { ReaderService } from '../../../auth/reader-service';
import { ReaderType } from '../../../reader/reader-types';
import { BulkScannerStorageOperations } from '../../../reader/storage-operations/bulk-scanner-storage-operations';
import * as toastr from 'toastr';
import { IStorageReaderOperations } from '../istorage-reader-operations';
import { GenericStorageItem } from '../../generic-storage-item';
import { DialogService } from 'aurelia-dialog';
import { ContainerStatusDialogue } from '../container-status-dialogue';
import { ContainerStatus } from '../../history/ContainerStatus';
import { Server_ConvertToContainerStatus } from '../../../api/json-map';

@useView('../../generic-storage.html')
@autoinject()
export class StorageBulkBookingOperations implements IStorageReaderOperations{

  // Modal dialog service
  public dialogService: DialogService;

  // Base list view model
  public storage: GenericStorage;

  public storageOperations: BulkScannerStorageOperations;
  // Secondary storage items required to be read for storage & withdrawal 
  public requiredItems: string[] = ["Dewar", "Canister", "Cane", "Sample"];

  // Constructor
  constructor(storage: GenericStorage, dialogService: DialogService) {

    this.dialogService = dialogService;

    this.storage = storage;
  }

  // Sets up the specific bindings for the table
  bind() {

    // Set command properties
 //   this.storage.selectMultiple = true;
    this.storage.canUseReader = true;
    this.storage.canUpdateDb = false;
    this.storage.canViewHistory = true;
    this.storage.canStoreItems = true;
    this.storage.canWithdrawItems = true;
    this.storage.canUseResetBtn = true;
    
    // General storage properties
    this.storage.storageType = 'tag';
    this.storage.type_singular = "Tag";
    this.storage.type_plural = "Tags";
    this.storage.title = "Booking In/Out";
    this.storage.subtitle = "";
    this.storage.apiPath = "BookingOperations";

    // Set up the table schema
    this.storage.schema = new Map<string, string>();
    this.storage.schema.set("UID", "UID");
    this.storage.schema.set("Position", "Position");
    this.storage.schema.set("Description", "Description");
    this.storage.schema.set("ContainerType", "Container Type");
    this.storage.schema.set("BatchName", "Batch Name");

    // Initailise reader and start polling
    this.startReader();
  }

  // Upon leaving the page
  deactivate() {

    this.stopReader();    
  }

  async startReader() {

    this.storageOperations = new BulkScannerStorageOperations(ReaderType.CRYOGATT_NR002);

    await this.storageOperations.start();

    ReaderService.startPollingReader(await this.pollReader.bind(this));
  }

  async stopReader() {

    // Call to stop polling the reader
    await ReaderService.stopPollingReader();

    this.storage.canUpdateDb = this.storageOperations.canUpdateDb = false;
  }

  // Main loop
  async pollReader() {

    await this.storageOperations.bookingInOut(this.requiredItems);
    this.storage.items = this.storageOperations.foundItems;
      this.storage.canUpdateDb = this.storageOperations.canUpdateDb;
      this.storage.subtitle = this.storageOperations.status;
      this.storage.subsubtitle = "No. of Samples: "
          + this.storage.items.filter(x => x.ContainerType === "Vial"
              || x.ContainerType == "Straw").length.toString()
          + " No. of Items scanned: " + this.storage.items.length; 
  }

  reset() {

    this.storageOperations.clear();
    this.storageOperations.foundItems = [];
    this.storageOperations.canUpdateDb = false;

    this.storage.title = "Booking In/Out";
    this.storage.subtitle = "";
  }

  async store() {

    var items = this.filterSelectedItems();

    if (items !== null) {

      await Http_EditStorage("BookingOperations?STORE", items).then((): void => {

          var status = "Stored";
          var containerStatuses = Server_ConvertToContainerStatus(items, status);

          Http_PostContainerStatuses(containerStatuses)
              .then(data => {

                  // Inform the user of the success
                  toastr.success("The items have successfully been stored.");
              }).catch(error => {

                  toastr.error("An error occurred and the database was not successfully updated.");
              });
      }).catch((): void => {

        // Inform the user of the error
        toastr.error("An error occurred and the database was not successfully updated.");
      });
    } else {

      // Inform the user no samples have been selected for storage
      toastr.warning("No samples are selected.");
      this.storageOperations.canUpdateDb = false;
      }

    this.reset();
  }

  async withdraw() {

    var items = this.filterSelectedItems();

    if (items !== null) {

      await Http_EditStorage("BookingOperations?WITHDRAW", items).then((): void => {

          this.SetStatus(items);

      }).catch((): void => {

        // Inform the user of the error
        toastr.error("An error occurred and the database was not successfully updated.");
      });
    } else {

      // Inform the user no samples have been selected for withdrawal
      toastr.warning("No samples are selected.");
      this.storageOperations.canUpdateDb = false;
      }

      this.reset();
    }

    async SetStatus(items: any[]) {
                
        // Launch a modal dialogue 
        await this.dialogService.open({
            viewModel: ContainerStatusDialogue, model: items, lock: true, position: ((modalContainer: Element, modalOverlay: Element) => {

            })
        }).whenClosed(result => {
            if (!result.wasCancelled) {

                toastr.success("The items have successfully been withdrawn.");
            }
            else {
                if (result.output) {

                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
        }).catch(result => {

            // Handle error
            console.log(result);
        });
    }
    
  private filterSelectedItems(): any[] {

    // Filter all required items and non required items (samples) that are selected
    var selectedItems = this.storage.items.filter(
      item => this.requiredItems.findIndex(requiredItem => requiredItem === item.ContainerType) !== -1 ||
        item.$isSelected);


    // Return null if there are no samples in list
    return selectedItems.find(
        item => this.requiredItems.findIndex(requiredItem => requiredItem === item.ContainerType) === -1) !==
      undefined
      ? selectedItems
      : null;
    }
}
