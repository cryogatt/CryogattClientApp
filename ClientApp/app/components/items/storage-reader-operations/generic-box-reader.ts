import * as toastr from 'toastr';
import { transient } from 'aurelia-dependency-injection';
import { SlotStates } from '../../reader/data-structures/slot-states';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { Http_EditStorage, Http_GetItems, Http_AddItem, Http_GetSingleTagIdentity } from '../../api/server';
import { BoxSlotsScannerStorageOperations } from '../../reader/storage-operations/box-slots-scanner-storage-operations';
import { Server_ConvertToGenericContainer, Server_ConvertToTagIdentity } from '../../api/json-map';
import { Container } from '../containers/container';

@transient()
export class GenericBoxReader {

  public title: string = "Place box on reader to begin";
  public subtitle: string;
  // boolean set to true when db has been updated
  public updated: boolean = false;
  // Operation layer for updating db, etc
  public storageOperations: BoxSlotsScannerStorageOperations;
  // Option for storage, withdrawl, etc
  public storageOption: SlotStates;
  // Condition for updating database
  public canUpdateDb: boolean;
  // Database is being updated
  public loading: boolean = false;
  // Interal variable for items that are two levels of storage deep
  public usingSecondDropMenu: boolean = false;
    public batteryLife: number = 0;
    public canViewTemperatureStats: boolean = false;
  // Array of box slots
  @bindable({ defaultBindingMode: bindingMode.twoWay }) slots;                 // In memory copy of the box slots 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) gParents: Container[]; // List of possible storage item grandparents
  @bindable({ defaultBindingMode: bindingMode.twoWay }) parents: Container[];  // List of possible storage item parents  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) gParent: Container;    // Chosen storage item grandparent
  @bindable({ defaultBindingMode: bindingMode.twoWay }) parent: Container;     // Chosen storage item parent
  @bindable({ defaultBindingMode: bindingMode.twoWay }) boxName;               // Label given to box

  private currentParentUid: string;

  constructor() {

    this.canUpdateDb = false;
  }

  // Retrieve possible parents for the box to be stored in
  public async loadBoxData() {

    this.loading = true;

    // Work around for co-routinue - waits for fsm to set the recorded uids of the slots on entry of new box
    while (!this.storageOperations.storageItemFound) {

      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("Waiting for data..");
    }

    this.setParentOptions();

    // Set label 
    if (this.storageOperations.storageItem && this.storageOperations.storageItem.hasOwnProperty('description')) {

      this.boxName = this.storageOperations.storageItem.description;
    }

    this.loading = false; 
  }

  async setParentOptions() {

    this.gParents = await this.getParents();

    if (this.storageOperations.storageItem.parentUidDescription.size > 0) {
      
      this.currentParentUid = this.storageOperations.storageItem.parentUidDescription.keys().next().value;
      
      this.gParentChangedEvent(this.currentParentUid);
    } else {

      this.currentParentUid = "Not stored";
      this.setDefaultParents();
    }
  }

  // Dropdown option changed
  async gParentChangedEvent(uid) {

    // Get record of the boxes parent
    let record = await Http_GetSingleTagIdentity(uid).catch(error => { toastr.error(error); });
    let selectedItem = Server_ConvertToTagIdentity(record.Tags[0]);

    // If second drop down menu is required - TODO Fix Constraint
    if (selectedItem.containerType === "Dewar") {

      this.parents = await this.getParents(uid);
      this.usingSecondDropMenu = true;
    } else if (selectedItem.containerType === "Stack") {

      this.parents = await this.getParents(selectedItem.parentUidDescription.keys().next().value);
      this.parent = this.parent = this.parents.find(cont => cont.uid === selectedItem.uid);
      this.gParent = this.gParents.find(cont => cont.uid === selectedItem.parentUidDescription.keys().next().value);
      this.usingSecondDropMenu = true;
    } else {
      
      this.usingSecondDropMenu = false;
      this.parents = await this.getParents();
      this.parent = this.parents.find(cont => cont.uid === selectedItem.uid);
    }
  }

  // Dropdown option changed
  async parentChangedEvent(uid) {

    if (!this.usingSecondDropMenu) {

      // Get record of the boxes parent
      let record = await Http_GetSingleTagIdentity(uid).catch(error => { toastr.error(error); });
      // Set the parent
      let selectedItem = Server_ConvertToTagIdentity(record.Tags[0]);

      if (selectedItem.containerType === "Dewar") {

        if (!this.gParents) {

          this.gParents = await this.getParents();
        }
        this.gParent = this.gParents.find(cont => cont.uid === selectedItem.uid);
        this.parent = undefined;
        this.parents = await this.getParents(uid);
        this.usingSecondDropMenu = true;
      } 
    }
  }

  public async getParents(uid?: string): Promise<any> {

    if (uid) {

      return await Http_GetItems('Containers?UIDS=' + uid).then(data => {

        if (data) {

          return Server_ConvertToGenericContainer(data);
        }
      }).catch(error => { toastr.error(error); });
    } else {

      return await Http_GetItems('Containers').then(data => {

        if (data) {

          return Server_ConvertToGenericContainer(data);
        }
      }).catch(error => { toastr.error(error); });
    }
  }

  public async setDefaultParents() {

    if (!this.parents || this.parents.length === 0 ) {

      this.parents = await this.getParents();
    }
  }

  // Used to change the location of the box
  public update() {

    if (this.parent) {

      // Location changed
      if (this.currentParentUid !== this.parent.uid) {

        this.restoreBox();
      }
      // Name changed
      if (this.storageOperations.storageItem.description !== this.boxName) {

        this.editName();
      }
    } else {

      toastr.warning("No option selected!");
    }
  }

  // Put box into database and store it
  public async registerBox() {

    if (this.boxName) {
      // Set the name from the user input
      this.storageOperations.storageItem.Description = this.boxName;

      if (this.parent) {
        // Post the data using the Web API
        await Http_AddItem('Containers' + "/" + this.parent.uid, this.storageOperations.storageItem)
          .then(data => {

            toastr.success(data.Description + " has successfully been added to the database");
          }).catch(error => {

            // An error has occurred, e.g. no data, or invalid field values
            toastr.error(error);
          });
      } else {

        toastr.warning("No option selected!");
      }
    } else {

      toastr.warning("Please enter the boxes name");
    }
  }

  // Change the location of where the box is stored
  private async restoreBox() {

    let rec = await Http_GetSingleTagIdentity(this.parent.uid).catch(error => { toastr.error(error); });

    let selectedItem = rec.Tags[0];
    // If a valid option and if not the current parent
    if (selectedItem && selectedItem.description !== this.currentParentUid) {

      let items;
      if (this.usingSecondDropMenu) {

        let pRec = await Http_GetSingleTagIdentity(this.gParent.uid).catch(error => { toastr.error(error); });

        items = [selectedItem, this.storageOperations.storageItem, pRec.Tags[0]];
      } else {

        items = [selectedItem, this.storageOperations.storageItem]; 
      }

      await Http_EditStorage("BookingOperations?STORE", items).then(data => {

        toastr.success("Box is now stored in " + this.parent.name);
        // Update current name for reference
        this.currentParentUid = this.parent.uid;
      }).catch(error => {

        toastr.warning(error);
      });
    } else {

      toastr.warn(this.parent + " not recognised!");
    }
  }

  private async editName() {

    // Get the container record of the box
    var containerRecord = await Http_GetItems('Containers/' + this.storageOperations.storageItem.uid).catch(error => {

      console.error(error);
    });

    if (containerRecord) {

      // Set the new name
      containerRecord.Description = this.boxName;

      // Update db
      await Http_EditStorage('Containers/' + this.storageOperations.storageItem.uid, containerRecord).then(data => {

        toastr.success("Box name has been changed");
        // Update the internal record
        this.storageOperations.storageItem.description = this.boxName;
      });
    }
  }

  public clearDisplay() {

    this.boxName = '';
    this.parents = [];
    this.parent = undefined;
  }

  // Handle to button for user to confirm operation
  public async confirm() {

    if (this.canUpdateDb && !this.loading) {

      // Start loading symbol
      this.loading = true;

      switch (this.storageOption) {

        case (SlotStates.NEW): {

          await this.bookNewSamples();
          break;
        }
        case (SlotStates.MISSING): {

          await this.bookOutMissingSamples();
          break;
        }
        case (SlotStates.REMOVED): {

          await this.bookOutRemovedSamples();
          break;
        }
        case (SlotStates.MOVED): { // Server checks on both states if the slot is reserved

          await this.bookSampleMovement();
          break;
        }
        case (SlotStates.RESERVED): { // Server checks on both states if the slot is reserved

          await this.bookSampleMovement();
          break;
        }
      }
      this.loading = false;
    }
  }

  // Used for being assigned samples into storage
  public async bookNewSamples() {

    // Filter slots for new tags and get thier observed containers
    var items = [];
    // Set the slots container position to the slot they are found in 
    var newStoredContainers = this.storageOperations.box.slots.filter(slot => slot.slotState === SlotStates.NEW);
    newStoredContainers.forEach(slot => slot.observedContainer.position = slot.slotNumber);
    // Add to list
    newStoredContainers.forEach(slot => items.push(slot.observedContainer));
    // Add the associated parents
    items.push(this.storageOperations.storageItem);

    await Http_EditStorage("BoxBookingOperations?STORE", items).then(data => {

      toastr.success("Samples successfully stored");
    }).catch(error => {

      toastr.error(error);
    });
    // Refresh slots for database change
    await this.storageOperations.updateSlots();
    
    this.updated = true;
  }

  // Used for booking out samples out of storage
  public async bookOutMissingSamples() {

    var items = [];
    // Filter slots for missing tags andlet the server set thier positions to 0
    var withdrawnContainers = this.storageOperations.box.slots.filter(slot => slot.slotState === SlotStates.MISSING);
    // Add the recorded containers to list
    withdrawnContainers.forEach(slot => items.push(slot.recordedContainer));
    // Add the associated parents
    items.push(this.storageOperations.storageItem);

    await Http_EditStorage("BoxBookingOperations?WITHDRAW", items).then(data => {

      toastr.success("Samples successfully withdrawn");
    }).catch(error => {

      toastr.error(error);
    });
    // Refresh slots for database change
    await this.storageOperations.updateSlots();

    this.updated = true;
  }

  // Used for booking out samples out of storage
  public async bookOutRemovedSamples() {

    var items = [];
    // Filter slots for missing tags andlet the server set thier positions to 0
    var withdrawnContainers = this.storageOperations.box.slots.filter(slot => slot.slotState === SlotStates.REMOVED);
    // Add the recorded containers to list
    withdrawnContainers.forEach(slot => items.push(slot.recordedContainer));
    // Add the associated parents
    items.push(this.storageOperations.storageItem);

    await Http_EditStorage("BoxBookingOperations?WITHDRAW", items).then(data => {

      toastr.success("Samples successfully withdrawn");
    }).catch(error => {

      toastr.error(error);
    });
    // Refresh slots for database change
    await this.storageOperations.updateSlots();

    this.updated = true;
  }

  // Used for booking the movement of samples between slots
  public async bookSampleMovement() {

    var items = [];
    // Filter slots for moved tags 
    var movedContainers = this.storageOperations.box.slots.filter(slot => slot.slotState === SlotStates.MOVED || slot.slotState === SlotStates.RESERVED);
    // Set the slots observed containers to thier new slot positions
    movedContainers.forEach(slot => slot.observedContainer.position = slot.slotNumber);
    // Add the observered containers to list
    movedContainers.forEach(slot => items.push(slot.observedContainer));
    // Add the associated parents
    items.push(this.storageOperations.storageItem);

    await Http_EditStorage("BoxBookingOperations?MOVEMENT", items).then(data => {

      toastr.success("Samples successfully reallocated");
    }).catch(error => {

      toastr.error(error);
    });
    // Refresh slots for database change
    await this.storageOperations.updateSlots();

    this.updated = true;
  }
}