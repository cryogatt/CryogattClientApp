import { BoxSlotsPositionalStorageScanner } from "../scanner/positional-storage-scanner/box-slots-positional-storage-scanner";
import { IStorageOperations } from "./istorage-operations";
import * as toastr from 'toastr';
import { ReaderType } from "../reader-types";
import { SlotStates } from "../data-structures/slot-states";

export class BoxSlotsScannerStorageOperations extends BoxSlotsPositionalStorageScanner implements IStorageOperations {

  // Priority of slot(s) state determines which operation should be made. I.e book new samples into storage before fixing moved vials.
  public priority: SlotStates;
  private slotsStatus: string;
  status: string;
  canUpdateDb: boolean;
  foundItems: any[];
  newSample: Map<string, number>;

  constructor(readerType: ReaderType) {

    // Initailise the reader
    super(readerType);
  }

  public async start() {

    await this.initBoxSlotScanner();
  }

  public async assignment(requiredItems: string[]) {

    toastr.error("Whoops! This readers does not support this operation.");
  }

  public async scanAgainestList(list: any[]) {

    // Poll the reader
    await this.scan();
    // If any movement since last read
    if (this.change) {

      // Scan the box
      await this.scanBoxSlots();

      // Change the state for all items in list
      this.setListItemsState(list);

      // Evaluate and set the operations priority 
      this.priority = this.evaluateOperationPriority();
      
      this.setChange(false);
    }
  }

  public async bookingInOut() {

    // Poll the reader
    await this.scan();
    // If any movement since last read
    if (this.change) {

      // Scan the box
      await this.scanBoxSlots();

      // Evaluate and set the operations priority
      this.priority = this.evaluateOperationPriority();

      this.setChange(false);
    }
  }

  public resetPriority() {

    // Evaluate and set the operations priority
    this.priority = this.evaluateOperationPriority();
  }

  public async updateSlots() {

    // Refresh the response from the reader
    await this.updateSlotsForReader(this.changedSlots);
    // Refresh the response from the database
    await this.updateSlotsForDatabase();
    // Update the state for each slot
    await this.updateAllSlots();
    // Evaluate and set the operations proirity 
    this.priority = this.evaluateOperationPriority();
  }

  private evaluateOperationPriority(): SlotStates {

    var operationPriority: SlotStates;
    // Based on the status of the slots set the priority of the operation
    if (this.box.slots.filter(slot => slot.slotState === SlotStates.NEW).length > 0) {

      // Make new slots take priority
      operationPriority = SlotStates.NEW;
      this.slotsStatus = "New Samples detected, press confirm to update database";
      this.canUpdateDb = true;
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.MOVED).length > 0) {

      operationPriority = SlotStates.MOVED;
      this.slotsStatus = "Sample movement, press confirm to update database";
      this.canUpdateDb = true;
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.RESERVED).length > 0) {

      operationPriority = SlotStates.RESERVED;
      this.slotsStatus = "Samples found in other samples slots, press confirm to update database";
      this.canUpdateDb = true;
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.REMOVED).length > 0) {

      operationPriority = SlotStates.REMOVED;
      this.slotsStatus = "Samples from list removed, press confirm to update database";
      this.canUpdateDb = true;
    }
    else if (this.box.slots.filter(slot => slot.slotState === SlotStates.PENDING).length > 0) {

      operationPriority = SlotStates.PENDING;
      this.slotsStatus = "Please pick items as required";
      this.canUpdateDb = false;
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.MISSING).length > 0) {

      operationPriority = SlotStates.MISSING;
      this.canUpdateDb = true;
      this.slotsStatus = "Samples removed, press confirm to update database";
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.UNASSIGNED).length > 0) {

      operationPriority = SlotStates.UNASSIGNED;
      this.slotsStatus = "Unrecognised samples in box! Please assign before storage";
      this.canUpdateDb = false;
    } else if (this.box.slots.filter(slot => slot.slotState === SlotStates.ERROR).length > 0) {

      operationPriority = SlotStates.UNASSIGNED;
      this.slotsStatus = "ERROR! Please remove vials marked with error status";
      this.canUpdateDb = false;
    } else {
      // No operations to be carried out
      this.slotsStatus = "";
      this.canUpdateDb = false;
    }

    return operationPriority;
  }

  // For every item in a given list change the state of the slot to pending
  public setListItemsState(list: any) {

    for (let it in list) {

      // If recorded as in the slot and is still in the slot
      let inSlotIndex = this.box.slots.findIndex(slot => (slot.getRecordedUid() === list[it].uid) && (slot.slotState === SlotStates.OCCUPIED));
      if (inSlotIndex !== -1) {

        this.box.slots[inSlotIndex].slotState = SlotStates.PENDING;
        continue;
      }
      // If recorded as in the slot and is still in the slot
      let removedIndex = this.box.slots.findIndex(slot => (slot.getRecordedUid() === list[it].uid) && (slot.slotState === SlotStates.MISSING));
      if (removedIndex !== -1) {

        this.box.slots[removedIndex].slotState = SlotStates.REMOVED;
      }
    }
  }

  public getSlotsStatus() {

    return this.slotsStatus;
  }
}