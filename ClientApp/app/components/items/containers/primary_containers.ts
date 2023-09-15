import { useView, autoinject } from 'aurelia-framework';
import { Server_ConvertToPrimaryContainers, Server_ConvertToMaterialInfo, Server_ConvertToSingleGenericContainer, Server_ConvertFromGenericContainer } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';
import { Containers } from './containers';
import { ReaderService } from '../../auth/reader-service';
import Server = require("../../api/server");
import { Http_GetItems } from '../../api/server';
import { MaterialInfo } from '../materials/material';
import * as toastr from 'toastr';
//! For Neck Reader
import { StorageBulkScanAgainestList } from "../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list";
import { Router } from 'aurelia-router';
import { GenericStorageItem } from '../generic-storage-item';
import { StorageType } from '../storage-type';

@useView('../generic-storage.html')
@autoinject()
export class PrimaryContainers {

    // Routing 
    private theRouter: Router;

    public param: string = "";

    // Base list view model
    public storage: GenericStorage;
    public containers: Containers;

    public scanOperation: any;

    public parentContainer: any;

    public materialInfos: MaterialInfo[];

    // Constructor
    constructor(storage: GenericStorage, containers: Containers, router: Router) {
      
        this.storage = storage;
        this.containers = containers;
        this.theRouter = router;
    }

    // Sets up the specific bindings for racks
    async activate(routeParams) {

        this.setDisplaySettings(routeParams);

        // General storage properties
        this.storage.storageType = 'container';
        this.storage.type_singular = "Sample";
        this.storage.type_plural = "Samples";
        this.storage.apiPath = "PrimaryContainers";
        this.storage.commandBtnTxt = "Audit Mode";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("Labelled", "Labelled"); 
        this.storage.schema.set("Position", "Position");
        this.storage.schema.set("BatchName", "Batch ID");

        // Get Material header fields for table
        this.materialInfos = Server_ConvertToMaterialInfo(await Http_GetItems("MaterialInfo"));
        if (this.materialInfos) {

          this.storage.schema.set(this.materialInfos[0].field, this.materialInfos[0].field);
          this.storage.schema.set(this.materialInfos[1].field, this.materialInfos[1].field);
          this.storage.schema.set(this.materialInfos[2].field, this.materialInfos[2].field);
          this.storage.schema.set(this.materialInfos[3].field, this.materialInfos[3].field);
        }

        // Command presence
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        this.storage.canViewHistory = true;
        this.storage.canAddToPickList = true;
        this.storage.canAddBatchToPickList = true;
        this.storage.canUpdatePickList = true;
        this.storage.canAuditItems = false; // TODO Change here

        // Fetch the data using the Web API
        var data = await Http_GetItems(this.storage.apiPath + this.param);
        this.storage.items = Server_ConvertToPrimaryContainers(data);

        if (Containers.getAuditMode()) {

          // Toggle audit mode
          Containers.setAuditMode(!Containers.getAuditMode());

          this.reset();
        }
    }

    // Upon leaving the page
    async deactivate() {

        if (ReaderService.readerOn) {

            await this.stopReader();
        }
    }

    // Edit a Container (launch modal dialogue)
    async edit() {

      this.storage.apiPath = "Containers";
      // Hand off to the generic object
      this.storage.edit(await this.getSelected(this.storage.selectedItem));
    }

    // View a Container (launch modal dialogue)
    async view() {

      this.storage.apiPath = "Containers";
      // Hand off to the generic object
      this.storage.view(await this.getSelected(this.storage.selectedItem));
    }

    async getSelected(item): Promise<any> {

      // Get the container response record
      return await Http_GetItems("Containers/" + item.uid).then(data => {

        if (data) {

          let storedItem = new GenericStorageItem();
          storedItem.storageType = StorageType.CONTAINER;
          storedItem.convertTo = Server_ConvertToSingleGenericContainer;
          storedItem.convertFrom = Server_ConvertFromGenericContainer;
          storedItem.item = Server_ConvertToSingleGenericContainer(data);

          return storedItem;
        }
      }).catch(error => {

        console.log(error);
      });
    }

    startReader() {

      // If there are items to be read
      if (this.storage.items.length !== 0) {

        this.storage.selectMultiple = true;
        this.scanOperation = new StorageBulkScanAgainestList(this.storage, ["Dewar"]);
      } else {

        this.stopReader();
        this.storage.canUseReader = false;
      }
    }

    async stopReader() {

      if (this.scanOperation) {

        await this.scanOperation.stopReader();
        // Work around for no way to dispose of object
        this.scanOperation = undefined;

        this.storage.selectMultiple = false;
        // Unselect items
        this.storage.items.forEach(item => item.$isSelected = false);

        this.storage.subtitle = "";
      }
    }

    audit() {

        this.reset();
    }

    async confirmAudit() {

      let audit: boolean = true;
        // UPDATE DB
      const selectedItems = this.storage.items.filter(item => item.$isSelected);
      let items = [];
      selectedItems.forEach(item => items.push(item.uid));

      if (items.length !== this.storage.items.length) {

        if (!confirm((this.storage.items.length - items.length) +
            " item(s) missing from audit. Do you wish to continue and mark these unselected items as missing?")) {

          audit = false;
        }
      }

      if (audit) {

        await Server.Http_AuditPrimaryContainers(items).then((): void => {

          toastr.success("Audit Successful");

          //Navigate to parent route
          this.theRouter.navigate("containers/" + Object.keys(this.parentContainer.ParentUidDescription)[0]);
        }).catch(error => {

          // An error has occurred, e.g. no data
          toastr.error(error);
        });
      }
    }

    // Reset settings
    reset() {

      // Toggle audit mode
      Containers.setAuditMode(!Containers.getAuditMode());

      var audit: boolean = Containers.getAuditMode();

      // Set multiple seltion to true in audit mode
      this.storage.selectMultiple = audit;

      this.storage.commandBtnTxt = audit ? "Stop Audit" : "Audit Mode";

      // Set to false when in audit mode as multiple items can be selected
      this.storage.canViewHistory = !audit;

      // Start/Stop the reader
      audit ? this.startReader() : this.stopReader();
    }

    setDisplaySettings(routeParams) {

      if (routeParams.item == undefined) {

        // Set default title for main entry
        this.storage.title = "Samples";
      } else {
        // Set Parameter
        this.param = "/" + routeParams.item;

        // Get the containers parents
        Server.Http_GetItems("BookingOperations?UIDS=" + routeParams.item).then(data => {

          if (data.hasOwnProperty('Tags')) {

            if (data.Tags.length > 0) {

              this.parentContainer = data.Tags[0];
              // Set titles to parent container
              this.storage.title = this.parentContainer.Description;
              this.storage.subtitle = this.parentContainer.ParentUidDescription[Object.keys(this.parentContainer.ParentUidDescription)[0]];
            }
          }
        }).catch(error => {

          console.log(error);
        });
      }
    }
}
