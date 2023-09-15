import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-dependency-injection';
import Server = require("../../api/server");
import { Slot } from '../../reader/data-structures/slot';
import { SlotStates } from '../../reader/data-structures/slot-states';
import { Http_GetSingleTagIdentity } from '../../api/server';
import { Server_ConvertToTagIdentity } from '../../api/json-map';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

@autoinject()
export class StorageSlotDialogue {

  // Dialogue header
  public title: string;
  // Dialogue sub-header
  public subtitle: string;
  // Modal binding
  public controller: DialogController;

  // Slot binding
  @bindable({ defaultBindingMode: bindingMode.twoWay }) slot: Slot;

  // Constructor
  constructor(dialogController: DialogController) {

    this.controller = dialogController;
  }
  
  public activate(model: Slot) {

    this.slot = model;

    // Determine the status of the slot and handle the display accordingly
    switch (this.slot.slotState) {

      case SlotStates.OCCUPIED: {

        this.displayContainer();
        break;
      }
      case SlotStates.MISSING: {

        this.displayMissingContainer();
        break;
      }
      case SlotStates.NEW: {

        this.displayNewContainer();
        break;
      }
      case SlotStates.MOVED: {

        this.displayMovedContainer();
        break;
      }
      case SlotStates.RESERVED: {

        this.displayReservedContainer();
        break;
      }
    }
  }

  // Container correctly found in slot
  private displayContainer() {

    Http_GetSingleTagIdentity(this.slot.getRecordedUid()).then(data => {

      if (data) {

        this.slot.recordedContainer = Server_ConvertToTagIdentity(data.Tags[0]);
        this.title = this.slot.recordedContainer.description;
      }
    }).catch(error => {

      console.error(error);
    });
  }

  private displayMissingContainer() {

    this.title = this.slot.recordedContainer.description + ' missing!';
  }

  private displayNewContainer() {

    this.title = 'New item ' + this.slot.observedContainer.description;
  }

  private displayMovedContainer() {

    this.title = this.slot.observedContainer.description + ' moved! ';
    this.subtitle = 'Belongs in position ' + this.slot.observedContainer.position + ' in ' + this.slot.observedContainer.parentUidDescription.get(this.slot.observedContainer.parentUidDescription.keys().next().value);
  }

  private displayReservedContainer() {

    Http_GetSingleTagIdentity(this.slot.getRecordedUid()).then(data => {

      // Valid response
      if (data.hasOwnProperty('Tags')) {

        // Set the recorded container
        this.slot.recordedContainer = Server_ConvertToTagIdentity(data.Tags[0]);

        this.title = this.slot.observedContainer.description + ' in reserved slot!';
        this.subtitle = this.slot.observedContainer.description + ' found in slot reserved for ' + this.slot.recordedContainer.description;
      }
    }).catch(error => {

      console.error(error);
    });
  }
}