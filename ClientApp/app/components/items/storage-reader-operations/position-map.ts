import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import Containerstates = require("../../reader/data-structures/container-states");
import ContainerStates = Containerstates.ContainerStates;
import { DialogService } from 'aurelia-dialog';
import { StorageSlotDialogue } from './storage-slot-dialogue';
import { StorageBoxSlotsAssignment } from './assignment/storage-box-slots-assignment';

// Represents the positions of containers in their associated position in a reader
@transient()
@autoinject()
export class PositionMap {

  public title: string;

  // Modal dialog service
  public dialogService: DialogService;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) states: ContainerStates[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) slots;

  constructor(dialogService: DialogService) {

    this.dialogService = dialogService;
  }

  // Lauch dialogue
  public async showDialogue(slot: any) {

    // Launch a modal dialogue 
    this.dialogService.open({
      viewModel: StorageSlotDialogue, model: slot, lock: false, position: ((modalContainer: Element, modalOverlay: Element) => {
        let container = modalContainer;
        let overlay = modalOverlay;
      })
    }).catch(result => {

      // Handle error
      console.log("dialog service error (catch)");
    });
  }

  public assign(slot: any) {

    // Launch a modal dialogue 
    this.dialogService.open({
      viewModel: StorageBoxSlotsAssignment, model: slot, lock: false, position: ((modalContainer: Element, modalOverlay: Element) => {
        let container = modalContainer;
        let overlay = modalOverlay;
      })
    }).catch(result => {

      // Handle error
      console.log("dialog service error (catch)");
    });
  }
}