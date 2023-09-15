import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-dependency-injection';
import Server = require("../../../api/server");
import { Slot } from '../../../reader/data-structures/slot';
import { Http_GetSingleTagIdentity, Http_EditStorage } from '../../../api/server';
import { Server_ConvertToTagIdentity, Server_ConvertManyToMaterialExtended } from '../../../api/json-map';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import Reader = require("../../../api/reader");
import Http_GetTagIdentTypeDesc = Server.Http_GetTagIdentTypeDesc;
import Reader_Ident = Reader.Reader_Ident;
import { ReaderType } from '../../../reader/reader-types';
import {  MaterialBatch } from '../../materials/material';
import { ContainerStates } from '../../../reader/data-structures/container-states';
import * as toastr from 'toastr';
import { SlotStates } from '../../../reader/data-structures/slot-states';

@autoinject()
export class StorageBoxSlotsAssignment {

  // Dialogue header
  public title: string;
  // Dialogue sub-header
  public subtitle: string;
  // Modal binding
  public controller: DialogController;
  // Container to add to db
  public vial: any;
  // State based on whether tag is not in db and is a vial
  public tagIsValid: boolean = false;
  public loading: boolean = false;
  // Label
  public label;
  // Slot binding
    @bindable({ defaultBindingMode: bindingMode.twoWay }) slot: Slot;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) types: string[] = ['Viability Tested', 'Safety Duplication', 'Cryobank'];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) type: string;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) containerState: ContainerStates;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) material: MaterialBatch;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) materials: MaterialBatch[];
  // Constructor
  constructor(dialogController: DialogController) {
    
    this.controller = dialogController;
  }

  public attached() {

    // Get access to user input label
    this.label = document.getElementById("label");
    this.label.focus();
  }

  public async activate(model: Slot) {

    this.slot = model;

    this.init();
  }

  private async init() {
    
    this.loading = true;
    this.title = "Validating tag..";
    if (await this.validateTag()) {

      this.loadBatches();
    }

    this.loading = false;
  }

  public async confirm() {

    await this.saveVial();

    await this.storeVial();

    await this.updateSlot();

    // Notify the controller to close the window
    this.controller.ok();
  }

  // Upon pressing enter
  public handleKeyPress(evt) {

    if (evt.keyCode === 13 && this.label) {

      if (this.vial.hasOwnProperty('Description') && this.vial.Description !== '') {

        this.confirm();
        evt.preventDefault();
      }
    } else {
      return true;
    }
  }

  private async saveVial() {

    this.vial.BatchId = this.material.uid;

      await Server.Http_AddItem("BookingOperations" + "/" + this.type, this.vial)
    .then(data => {

      toastr.success(this.vial.Description + " has successfully been added to the database");

    }).catch(error => {

      // An error has occurred, e.g. no data, or invalid field values
      toastr.error(error);
    });
  }

  private async storeVial() {

    let items = [];
    // Get new record of vial
    await Http_GetSingleTagIdentity(this.vial.Uid).then(data => {

      if (data) {
        // Set the slot's observerd container
        this.slot.observedContainer = Server_ConvertToTagIdentity(data.Tags[0]);
        this.slot.setObservedUid(this.vial.Uid);
        items.push(this.slot.observedContainer);
      }
    }).catch(error => {

      // An error has occurred, e.g. no data, or invalid field values
      toastr.error(error);
    });

    // Get the record of the parent
    await Http_GetSingleTagIdentity(this.slot.storageItemUid).then(data => {

      if (data) {
        items.push(Server_ConvertToTagIdentity(data.Tags[0]));
      }
    }).catch(error => {

      // An error has occurred, e.g. no data, or invalid field values
      toastr.error(error);
    });

    this.slot.observedContainer.position = this.slot.slotNumber;

    await Http_EditStorage("BoxBookingOperations?STORE", items).then(data => {

      toastr.success("Samples successfully stored");
      // Set the recorded container for the slot
      this.slot.recordedContainer = this.slot.observedContainer;
      this.slot.setRecordedUid(this.slot.getObservedUid());
    }).catch(error => {

      // An error has occurred, e.g. no data, or invalid field values
      toastr.error(error);
    });
  }

  private async updateSlot() {

    this.slot.updateSlotState();
  }

  private async validateTag(): Promise<boolean> {

    if (await this.tagIsVial()) {
      // May not be required as tag must not be in db to get to this point
      if (await this.tagNotInDb()) {

        this.title = "Select which batch the sample belongs to and press confirm";
        this.tagIsValid = true;
        this.containerState = ContainerStates.UNFILLED;
        return true;
      } else {
        
        this.containerState = ContainerStates.FILLED;
        this.title = this.vial.description + " " + "in database!";
      }
    } else {

      this.title = "Item is not a Vial!";
      this.containerState = ContainerStates.ERROR;
      this.slot.slotState = SlotStates.ERROR;
    }
    return false;
  }
  
  private async tagIsVial(): Promise<boolean> {

    var isVial: boolean = false;
    // Read the tag control block for ident                 // TODO - Change for new 10x10
    let tagIdentResp = await Reader_Ident(String(ReaderType.CRYOGATT_R10101), this.slot.getObservedUid(), this.slot.slotNumber)
      .catch(error => {

      console.log(error);
      return false;
    });

    // Valid response
    if (tagIdentResp.hasOwnProperty('Ident')) {

      // Is Ident set
      if (tagIdentResp.Ident === "00000000") {

        return false;
      }
      // Query the database to determine what the ident is
      var tagType = await Http_GetTagIdentTypeDesc(tagIdentResp.Ident).catch(error => {

        console.log(error);
        return false;
      });
      // Add these propperties to data structure immediatley after being read incase removed
      this.vial = {
         Uid : this.slot.getObservedUid(),
         TagIdent: parseInt(tagIdentResp.Ident, 16),
      };

      isVial = tagType === "Vial";
    }

    return isVial; 
  }

  private async tagNotInDb(): Promise<boolean> {

    var vial = await Http_GetSingleTagIdentity(this.slot.getObservedUid()).catch(error => {

      console.log(error);
      return false;
    });

    // Valid response
    if (vial.hasOwnProperty('Tags')) {
      // Valid tag
      if (vial.Tags[0] === null) {
        return true;
      } else {

        this.vial = Server_ConvertToTagIdentity(vial.Tags[0]);
      }
    }

    return false;
  }

  private async loadBatches() {

    await Server.Http_GetItems("Materials").then(data => {

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