import { BoxPositionalStorageScanner } from "./box-positional-storage-scanner";
import { ReaderType } from "../../reader-types";
import { BoxStates } from "../../data-structures/box-states";
import { Inventory } from "../../data-structures/inventory";
import * as toastr from 'toastr';

// Purpose of class is to scan the slots with the box and update their observed uid from the read and the slot status
export class BoxSlotsPositionalStorageScanner extends BoxPositionalStorageScanner {

  protected status: string;

  constructor(readerType: ReaderType) {

    // Initailise the reader
    super(readerType);
  }

  // Initial reader and internal variables
  public async initBoxSlotScanner() {

    await this.initBoxScanner();
  }

  // Main loop to keep reading box state and maintain the slot states
  public async scanBoxSlots() {

    // Scan the box tag in the reserved slot
    var boxState: BoxStates = await this.scanBox();

    // + translates the state to a number - workaround for a typescript bug
    switch (+boxState) {

      case BoxStates.NO_BOX_SIG: {

        this.status = "Insert box on to reader";
        break;
      }

      case BoxStates.BAD_TAG_SIG: {

        this.status = "Invalid box";
        toastr.error("Invalid Tag!");
        break;
      }

      case BoxStates.UNKNOWN_BOX_SIG: {

        this.status = "Please register box to continue";
        break;
      }

      case BoxStates.KNOWN_BOX_SIG: {
        
        // Work around for co-routinue - waits for fsm to set the recorded uids of the slots on entry of new box
        while (!this.storageItemFound) {

          await new Promise((resolve) => setTimeout(resolve, 200));
          console.log("Waiting for data.." + this.storageItemFound);
        }

        if (this.storageItem && this.storageItem.hasOwnProperty('description')) {
          this.status = this.storageItem.description + " detected";
        }
        // Update the observed containers for the changed slots from the reader response
        await this.updateSlotsForReader(this.changedSlots);
        // Update the state for each slot
        await this.updateAllSlots();
        break;
      }    
    }
  }

  public getBoxStatus() {

    return this.status;
  }

  // Updates the slots when the reader output changes
  protected async updateSlotsForReader(updatedSlots: Inventory[]) {

    // Set all changed slots to loading status
    await this.box.setSlotsToLoading(this.changedSlots);
    // Update the observed containers for the changed slots from the reader response
    await this.box.setBoxObservedContents(this.changedSlots);
  }

  // Updates the slots when the database output changes
  protected async updateSlotsForDatabase() {

    // Set the recorded uids for slots from db
    await this.updateBoxContents();
  }

  protected async updateAllSlots() {

    await this.box.updateAllSlots();
  }
}