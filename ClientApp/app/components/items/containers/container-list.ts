import { useView, inject } from 'aurelia-framework';
import { Server_ConvertToGenericContainer } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';
import { Containers } from './containers';
import { Router } from 'aurelia-router';
import * as toastr from 'toastr';
import { ReaderService } from '../../auth/reader-service';
import { Http_AuditItem, Http_GetContainerContentsLevel } from '../../api/server';
import Server = require("../../api/server");
//! For Neck Reader
import { StorageBulkScanAgainestList } from "../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list";

@useView('../generic-storage.html')
@inject(GenericStorage, Containers, Router)
export class ContainerList {

    // Base list view model
    private storage: GenericStorage;
    private containers: Containers;

    public scanOperation: any;

    // Routing 
    private theRouter: Router;
    static inject() { return [Router]; }

    // Parameters for URL
    public param: string = "";

    // Top level containers
    public home: boolean = false;

    public parentContainer: any;

    // Constructor
    constructor(storage, containers, router: Router) {
        this.storage = storage;
        this.containers = containers;
        this.theRouter = router;        
    }

    // Sets up the specific bindings for ContainerList
    async activate(routeParams) {

        // General storage properties
        this.storage.apiPath = "Containers";
        this.storage.storageType = 'container';
        this.storage.type_singular = "Storage";//TODO Sort propper names for this. Maybe types read out of database?
        this.storage.type_plural = "ContainerList";

        // Sets the internal & display settings depending on the level of containers 
        this.setLevelSettings(routeParams);
       
        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("name", "Name");
        this.storage.schema.set("type", "Type");
        this.storage.schema.set("addedDate", "Added");
        this.storage.schema.set("containsQty", "Contains Qtty");
        this.storage.schema.set("containsType", "Contains Type");

        // Set up container properties
        this.containers.containsTypeSingular = "Container";
        this.containers.containsTypePlural = "Containers";
        
        // Command presence
        this.storage.canCreateItem = true; // TODO Change here
        this.storage.createItemInfo = "Create Non RFID Enabled Containers such as Freezers, etc";
        this.storage.canAuditItems = false; // TODO Change here
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        this.storage.canViewHistory = true;
        this.containers.canAddContents = true;
        this.containers.canViewContents = true;
        this.containers.canViewAliquots = true;
        this.storage.canViewHistory = true;
        this.storage.commandBtnTxt = "Audit Mode";

        await this.storage.fetch(this.storage.apiPath + "/" + this.param, Server_ConvertToGenericContainer);

        if (Containers.getAuditMode()) {
          
          // Toggle audit mode
          Containers.setAuditMode(!Containers.getAuditMode());

          this.reset();
        }

        // Clear the Parameter
        this.param = "";
    }

    // Upon leaving the page
    async deactivate() {

      if (ReaderService.readerOn()) {

        await this.stopReader();
      }
    }

    // Create a new Container (launch modal dialogue)
    create() {

        this.storage.apiPath = "NonRFIDEnabledContainers";
        // Hand off to the generic object
        this.storage.create(this.containers.getNew());
    }

    // Edit a Container (launch modal dialogue)
    edit() {

        this.storage.apiPath = "Containers";
        // Hand off to the generic object
        this.storage.edit(this.containers.getSelected(this.storage.selectedItem));
    }

    // View a Container (launch modal dialogue)
    view() {

      this.storage.apiPath = "Containers";
        // Hand off to the generic object
        this.storage.view(this.containers.getSelected(this.storage.selectedItem));
    }

    // Start/Stop audit mode
    audit() {

       this.reset();
    }

    // Sets the internal & display settings depending on the level of containers 
    setLevelSettings(routeParams) {

      // Undefined for top level
      if (routeParams.item == undefined) {

        this.home = true;
        // Set default title for main entry
        this.storage.title = "Storage Records";

        Containers.setAuditMode(false);
      } else {

        this.home = false;

        // Set Parameter
        this.param = "?UIDS=" + routeParams.item;

        // Get the containers parents
        Server.Http_GetItems("BookingOperations" + this.param).then(data => {

          if (data.hasOwnProperty('Tags')) {

            if (data.Tags.length > 0) {

              this.parentContainer = data.Tags[0];
              // Set titles to parent container
              this.storage.title = this.parentContainer.Description;
              this.storage.subtitle = this.parentContainer.ParentUidDescription[Object.keys(this.parentContainer.ParentUidDescription)[0]];
            }
          }
        }).catch(error => {

          console.error(error);
        });
      }
    }

    // Determines which route to take depending on the containers being primary or secondary
    public async viewContents() {

        var resp = await Http_GetContainerContentsLevel(this.storage.selectedItem.uid).catch(error => {

          // An error has occurred, e.g. no data
          toastr.error(error);
        });

        if (resp) {

          if (resp === 2) {

            // Navigate to primary samples page
            this.theRouter.navigate("samples/" + this.storage.selectedItem.uid);
          } else {
            // Navigate to next level
            this.theRouter.navigate("containers/" + this.storage.selectedItem.uid);
          }
        }
    }

    // Confirmation of audit
    async confirmAudit() {

        // Update db
        await Http_AuditItem(this.storage.selectedItem.uid)
            .then((): void => {

                toastr.success(this.storage.selectedItem.name + " successfully audited.");

        }).catch(error => {

            // An error has occurred, e.g. no data
            toastr.error(error);
        });

        if (this.storage.selectedItem.containsQty !== 0) {
          // Navigate to child containers
          this.viewContents();
        }
    }

    // Start/Stop the audit mode
    reset() {

        // Toggle audit mode
        Containers.setAuditMode(!Containers.getAuditMode());

        var audit: boolean = Containers.getAuditMode();
        
        // Set to false when in audit mode as multiple items can be selected
        this.storage.canViewHistory = !audit; 

        this.storage.commandBtnTxt = audit ? "Stop Audit": "Audit Mode";

        // Start/Stop the reader
        audit ? this.startReader() : this.stopReader();
    }

    async startReader() {

        // If there are items to be read
        if (this.storage.items.length !== 0) {

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
      }

      // Unselect items
      this.storage.items.forEach(item => item.$isSelected = false);
    }
}
