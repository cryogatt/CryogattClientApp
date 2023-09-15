import { SlotStates } from "./slot-states";
import { Http_GetSingleTagIdentity } from "../../api/server";
import * as toastr from 'toastr';
import { Server_ConvertToTagIdentity } from "../../api/json-map";

export class Slot {

  public storageItemUid: string;
  // Indexed from 1
  public slotNumber: number;
  // State of the slot
  public slotState: SlotStates;
  // Where the recorded uid is what the database says is the uid in this slot
  public getRecordedUid() { return this.recordedUid; }
  public setRecordedUid(uid: string) { this.recordedUid = uid; }
  // Where the observed uid is what the reader says is the uid in this slot
  public getObservedUid() { return this.observedUid; }
  public setObservedUid(uid: string) { this.observedUid = uid; }
  // Record of the tag physically in slot (if found) - Assumes one tag per slot
  public observedContainer: any;//TagIdentity;
  // Database record of the tag in slot (if found) - Assumes one tag per slot
  public recordedContainer: any;//TagIdentity;

  // Default to empty
  private recordedUid: string = '';
  private observedUid: string = '';

  // Updates the slot  state
  public async updateSlotState(): Promise<SlotStates> {

    this.slotState = await this.evaluateSlotState();

    return this.slotState;
  }

  public setAsEmpty() {

    this.slotState = SlotStates.EMPTY;
    this.observedUid = "";
  }

  // Accesses the state of the slot
  private async evaluateSlotState(): Promise<SlotStates> {

    var recordedAsOccupied: boolean = !this.uidEmpty(this.recordedUid);
    var tagInSlot: boolean = !this.uidEmpty(this.observedUid);

    // Database recorded a container in the slot and there is a tag in position
    if (recordedAsOccupied && tagInSlot) {

      // Is the container in the right slot
      if (this.containerCorrectlyStored()) {

        return SlotStates.OCCUPIED;
      } else {

        if (this.observedContainer !== null && this.observedContainer) {

          // Tag in another tags slot
          return SlotStates.RESERVED;
        } else {
          // Tag in slot is not in db
          return SlotStates.UNASSIGNED;
        }
      }
    } else if (!tagInSlot && recordedAsOccupied) {

      return SlotStates.MISSING;
    } else if (!recordedAsOccupied && tagInSlot) {

      if (this.observedContainer !== null && this.observedContainer) {

        if (!this.isAlreadyStored(this.observedContainer)) {

          return SlotStates.NEW;
        } else {

          return SlotStates.MOVED;
        }
      } else {
        // Tag in slot is not in db
        return SlotStates.UNASSIGNED;
      }      
    } else if (!recordedAsOccupied && !tagInSlot) {

      // Empty slot
      return SlotStates.EMPTY;
    }
  }

  // The tag being read by the reader is the same tag recorded in this slot in the database
  public containerCorrectlyStored(): boolean {

    return (this.recordedUid === this.observedUid);
  }

  private uidEmpty(uid: string): boolean {

    return (uid === "") || (uid === undefined);
  }

  private async getContainerInSlot(): Promise<any> {

    return await Http_GetSingleTagIdentity(this.observedUid).then(data => {

      // Valid response
      if (data.hasOwnProperty('Tags')) {

        return data.Tags[0];
      } else {
        return null;
      }
    }).catch(error => {

      toastr.error(error);
    });
  }

  private async getContainerInDb(): Promise<any> {

    return await Http_GetSingleTagIdentity(this.recordedUid).then(data => {

      // Valid response
      if (data.hasOwnProperty('Tags')) {

        return data.Tags[0];
      } else {
        return null;
      }
    }).catch(error => {

      toastr.error(error);
    });
  }

  public setObservedContainer(item: any) {

    this.observedContainer = Server_ConvertToTagIdentity(item);
  }

  public setRecordedContainer(item: any) {

    this.recordedContainer = Server_ConvertToTagIdentity(item);
  }

  // Checks if container is stored in a box
  private isAlreadyStored(item: any): boolean {

    return item.position !== 0;
  }
}