import { useView, autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { GenericStorage } from '../generic-storage';
import { Server_ConvertToPicklist } from '../../api/json-map';
import { ReaderService } from '../../auth/reader-service';
import { Http_GetItems } from '../../api/server';
import Server = require("../../api/server");
import * as toastr from 'toastr';
//! For 10x10
 import { StorageBoxScanAgainestList } from '../storage-reader-operations/scan-againest-list/storage-box-scan-againest-list';
import { StorageColdBoxScanAgainestList } from '../storage-reader-operations/scan-againest-list/storage-cold-box-scan-againest-list';
import { DialogService } from 'aurelia-dialog';
import { ContainerStatusDialogue } from '../storage-reader-operations/container-status-dialogue';
//! For Neck Reader
 import { StorageBulkScanAgainestList } from"../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list";
import { AsyncCompleter } from 'readline';
import { StorageColdBoxSlotsBookingOperations } from '../storage-reader-operations/booking-operations/storage-cold-box-slots-booking-operations';
import { ReaderType } from "../../reader/reader-types";

@useView('../generic-storage.html')
@autoinject()
export class PickList {

    // Base list view model
    public storage: GenericStorage;

    //public materialInfos: MaterialInfo[];

    // Page navigation
    private theRouter: Router;

    public scanOperation: any;

    // Modal dialog service
    public dialogService: DialogService;

    // Constructor
    constructor(storage: GenericStorage, router: Router, dialogService: DialogService) {

        this.storage = storage;
        this.theRouter = router;
        this.dialogService = dialogService;
    }

    // Sets up the specific bindings for Pick List
    async bind() {

        // Command bindings
        this.storage.canDeleteFromPickList = true;
        this.storage.canUpdatePickList = true;
        this.storage.canUseReader = true;
        this.storage.canUpdateDb = false;
        this.storage.canStoreItems = false;
        this.storage.canWithdrawItems = false;
        this.storage.canViewHistory = true;

        // General storage properties
        this.storage.type_singular = "Pick List";
        this.storage.type_plural = "Pick List";
        this.storage.title = "Pick List";
        this.storage.apiPath = "picklist";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("BatchName", "Batch");
        this.storage.schema.set("primary_description", "Labelled");
        // Get Material header fields for Accession no
        //this.materialInfos = Jsonmap.Server_ConvertToMaterialInfo(await Http_GetItems("MaterialInfo"));
        //if (this.materialInfos) {
        //    this.storage.schema.set("configurableField_2", this.materialInfos[1].field);
        //}
        this.storage.schema.set("accessionNo", "Accession No");
        this.storage.schema.set("position", "Position");
        this.storage.schema.set("parent_description", "Stored in");
        this.storage.schema.set("gParent_description", "Stack");
        this.storage.schema.set("ggParent_description", "Dewar");





        // Set table data
        this.storage.items = Server_ConvertToPicklist(await Http_GetItems(this.storage.apiPath));

        // If connected to reader service
        ReaderService.isConnected().then(resp => {

          if (resp) {

            // If items are on the pick list scan scanner
            if (this.storage.items && this.storage.items.length !== 0) {

                this.storage.selectMultiple = true;
           //     this.scanOperation = new StorageColdBoxScanAgainestList(this.storage, this.theRouter);
                this.scanOperation = new StorageBoxScanAgainestList(this.storage, this.theRouter,ReaderType.CRYOGATT_R10101); //! For 10x10
            //   this.scanOperation = new StorageBulkScanAgainestList(this.storage, ["Dewar", "Canister", "Cane", "Sample"]); 
            }
          }
        });
    }

    // Upon leaving the page
    async deactivate() {

      if (ReaderService.readerOn) {

        await ReaderService.stopPollingReader();
      }
    }

    reset() {

      this.scanOperation.reset();

      Http_GetItems(this.storage.apiPath)
        .then(data => {

          var items = Server_ConvertToPicklist(data);
          if (items) {

            // Store the result locally
            this.storage.items = items;
          }
          else {
            // Undefined items list
            toastr.error("An error occurred, and no records can be displayed.");
            this.storage.items = [];
          }
        }).catch(error => {

          // An error has occurred, e.g. no data
          toastr.error(error);
        });
    }

    async withdraw() {

      var items = this.scanOperation.filterSelectedItems();

      if (items !== null) {

          await Server.Http_EditStorage("BookingOperations?WITHDRAW", items).then((): void => {

            this.SetStatus(items);
        }).catch((): void => {

          // Inform the user of the error
          toastr.error("An error occurred and the database was not successfully updated.");
        });
      } else {

        // Inform the user no samples have been selected for withdrawal
        toastr.warning("No samples are selected.");
        this.scanOperation.storageOperations.canUpdateDb = false;
      }

      // Refresh list
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
}