import { IStorageReaderOperations } from "../istorage-reader-operations";
import { ReaderType } from "../../../reader/reader-types";
import { ReaderService } from "../../../auth/reader-service";
import { Http_GetTagsIdentity, Http_GetTagIdentTypeDesc, Http_GetItems } from "../../../api/server";
import { Reader_Ident } from "../../../api/reader";
import { DialogController } from "aurelia-dialog";
import { JSON_PrimaryContainer, JSON_container, Server_ConvertManyToMaterialExtended } from "../../../api/json-map";
import { bindable, bindingMode } from "aurelia-framework";
import { Slot } from "../../../reader/data-structures/slot";
import { ContainerStates } from "../../../reader/data-structures/container-states";
import { MaterialBatch } from "../../materials/material";
import { autoinject, transient } from "aurelia-dependency-injection";
import Server = require("../../../api/server");
import { PositionalScannerStorageOperations } from "../../../reader/storage-operations/positional-scanner-storage-operations";
import * as toastr from 'toastr';

@transient()
@autoinject()
export class StoragePositionalGenericAssignment implements IStorageReaderOperations {

  public apiPath: string;
  public title: string = "Please scan an item to begin";
  public item: any;
  public controller: DialogController;
  // Hardcoded for bulk reader
  private storageOperations: PositionalScannerStorageOperations;
  // Internal states
  private canUpdateDb: boolean = false;
  private itemIsScanned: boolean = false;
  private nameIsGiven: boolean = false;
  private primaryContainer: boolean = true;
  // Label
  public label;
  // Slot binding
@bindable({ defaultBindingMode: bindingMode.twoWay }) slot: Slot;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) types: string[] = ['Viability Tested', 'Safety Duplication', 'Cryobank'];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) type: string;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) containerState: ContainerStates = ContainerStates.DEFAULT;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) material: MaterialBatch;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) materials: MaterialBatch[];

  // Constructor
  constructor(dialogController: DialogController) {

    this.controller = dialogController;
  }

  async bind() {

    await this.startReader();
  }

  async unbind() {

    await this.stopReader();
  }

  async attached() {

    // Get access to user input label
    this.label = document.getElementById("label");
    this.label.focus();
  }

  async activate(model) {

    if (!model) {

      await this.loadBatches();
    } else {

      this.type = model.type;
      this.primaryContainer = model.primaryContainer;
      this.materials = model.materials;
      this.material = model.material;
    }
  }

  // Upon pressing enter
  public handleKeyPress(evt) {

    if (evt.keyCode === 13 && this.label) {

      if (this.item.hasOwnProperty('Description') && this.item.Description !== '') {

        this.confirm();
        evt.preventDefault();
      }
    } else {
      return true;
    }
  }

  // Update database
  public async confirm() {

    console.log(this.canUpdateDb);

    if (this.canUpdateDb) {

      if (this.primaryContainer) {

        this.item.BatchId = this.material.uid;
        }

        // Add to database
        await Server.Http_AddItem(this.apiPath + '/' + this.type, this.item).then(data => {

        if (data) {

          toastr.success(this.item.Description + " successfully added.");
        }

            // Close the dialogue with current settings to prevent reloading and manual sections
            this.controller.close(true, { "primaryContainer": this.primaryContainer, "materials": this.materials, "material": this.material, "type": this.type });
      }).catch(error => {

        // An error has occurred, e.g. no data
        toastr.error(error);
      });
    }
  }

  async startReader() {

    this.storageOperations = new PositionalScannerStorageOperations(ReaderType.CRYOGATT_SR012); // TODO - Remove hardcoded dependency on neck reader and replace with some method of a selection of a bulk reader

    await this.storageOperations.start();

    await ReaderService.startPollingReader(await this.pollReader.bind(this));
  }

  async stopReader() {

    // Call to stop polling the reader
    await ReaderService.stopPollingReader();
  }

  async pollReader() {

    if (!this.canUpdateDb) {

      if (!this.itemIsScanned) {
        // If reader has scanned item
        if (!this.storageOperations.canUpdateDb) {

          if (await this.validTagFound()) {
            // Change state
            this.containerState = ContainerStates.UNFILLED;
            this.itemIsScanned = true;
          }
        }
      } else {

        // Has the description (label) been given?
        if (!this.nameIsGiven) {

          // If an input has been given by the user
          this.nameIsGiven = this.item.Description !== undefined;
        } else {

          this.title = "Press Save to update the database";
          this.canUpdateDb = true;
        }
      }
    }
  }

  async validTagFound(): Promise<boolean> {

    // Scan the reader for new items
    if (await this.readerFoundNewItems()) {

      if (this.singleItemScanned()) {

        if (!await this.itemIsRecognised()) {

          return await this.tagIdentIsValid();
        }
      }
    }
    return false;
  }

  // Ensure only one item has been scanned
  singleItemScanned(): boolean {

    if (this.storageOperations.changedSlots.length === 0 || !this.storageOperations.changedSlots[0].hasOwnProperty('UID')) {

      return false;
    }
    if (this.storageOperations.changedSlots[0].UID.length === 1) {

      return true;
    }
    else if (this.storageOperations.previousScan[0].UID.length === 0) {

      this.title = "Please present the tagged item to the Reader";
    }
    else if (this.storageOperations.previousScan[0].UID.length > 1) {

      this.title = "Please scan the items individually";
    }

    return false;
  }

  async readerFoundNewItems(): Promise<boolean> {

    // Scan the reader
    await this.storageOperations.scan();

    // If a change since last read has been detected
    if (this.storageOperations.change) {

      this.storageOperations.setChange(false);

      return true;
    } else {

      return false;
    }
  }

  async itemIsRecognised(): Promise<boolean> {

    let recongised: boolean = false;
    // Query the server for the tags Identity
    await Http_GetTagsIdentity(this.storageOperations.changedSlots).then(data => {

      recongised = data.Tags[0] !== null;
      if (recongised) {
        this.title = data.Tags[0].Description + " in database!";
        this.containerState = ContainerStates.FILLED;
      }
    }).catch(error => {

      console.log(error);
      toastr.warning(error);
    });
    return recongised;
  }

  async tagIdentIsValid(): Promise<boolean> {

    // Read the first (only) read tags control block for ident
    const tagIdent = await Reader_Ident(this.storageOperations.reader.readerId, this.storageOperations.changedSlots[0].UID[0]).catch(error => {

      console.log(error);
      toastr.warning("Item removed too quickly!");
    });

    // Query the database to determine what the ident is
    const tagType = await Http_GetTagIdentTypeDesc(tagIdent.Ident).catch(error => {

      console.log(error);
      toastr.warning(error);
    });

    if (tagType === undefined) {

      this.title = this.title = "Tag Identidy not recognised!";
      this.containerState = ContainerStates.INVAILD;
      return false;
    } else {

      this.title = tagType + " Detected";
    }

    // set the state of the screen based on which level of item is being scanned
    await Http_GetItems('ContainerLevel?TAGIDENT=' + parseInt(tagIdent.Ident, 16)).then(data => {

      if (data) {

        this.primaryContainer = data === 2;
        this.initItem();
      }
    }).catch(error => {

      console.log(error);
      toastr.warning(error);
    });
    // Set the TagIdent of the item
    this.item.TagIdent = parseInt(tagIdent.Ident, 16);

    return true;
  }

  initItem() {

    if (this.primaryContainer) {

      this.item = new JSON_PrimaryContainer();
      this.apiPath = "BookingOperations/";
    } else {

      this.item = new JSON_container();
      this.apiPath = "Containers/";
    }

    // Set the uid
    this.item.Uid = this.storageOperations.changedSlots[0].UID[0];
  }

  private async loadBatches() {

    await Http_GetItems("Materials").then(data => {

      if (data) {

        this.materials = Server_ConvertManyToMaterialExtended(data);
        this.materials = this.materials.reverse();
      }
    }).catch(error => {

      console.log(error);
      return false;
    });
  }
} 