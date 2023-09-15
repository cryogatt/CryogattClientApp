import { Slot } from './slot';
import Slotstates = require("./slot-states");
import SlotStates = Slotstates.SlotStates;
import { Http_GetParentPrimaryContainers, Http_PostTagsIdentity } from '../../api/server';
import { Server_ConvertToPrimaryContainers, JSON_PrimaryContainer } from '../../api/json-map';
import { PrimaryContainer } from '../../items/containers/primary_container';
import { Inventory } from './inventory';

export class Box {

  constructor(slotQty: number) {

    // Initialise slots array
    this.slots = [];
    for (let s = 0; s < slotQty; s++) {

      let slot = new Slot();
      slot.slotNumber = s + 1;
      // Set all states to empty 
      slot.slotState = SlotStates.EMPTY;
      this.slots.push(slot);
    }
  }

  public uid: string;
  // Reserved slot for box tag
  public readonly reservedPosition = 1;
  public slots: Slot[];

  public setUid(uid) {

    this.uid = uid;

    this.slots.forEach(slot => slot.storageItemUid = uid);
  }

  // Set the reserved slot for the box
  public setReservedSlot() {

    var index = this.slots.findIndex(posn => posn.slotNumber === this.reservedPosition);
    this.slots[index].setObservedUid(this.uid);
    this.slots[index].setRecordedUid(this.uid);
    this.slots[index].slotState = SlotStates.STORAGE_TAG;
  }

  // Get all storage containers belonging to box
  public async getBoxContentsfromDb(): Promise<any> {

    return await Http_GetParentPrimaryContainers(this.uid).catch(error => { console.log(error); });
  }

  // Set the slots recorded containers the database response of the contents of the box
  public setBoxRecordedContents(boxContents: JSON_PrimaryContainer) {

    // Reset all recorded uids
    this.slots.forEach(slot => slot.setRecordedUid(''));

    // For every slot in the box set the recorded item.
    for (var container in boxContents) {

      this.slots.find(posn => posn.slotNumber === boxContents[container].Position).setRecordedUid(boxContents[container].Uid);
      this.slots.find(posn => posn.slotNumber === boxContents[container].Position).setRecordedContainer(boxContents[container]);
    }
  }

  // Before processing of the updated slots occurs set their state to loading 
  public setSlotsToLoading(updatedSlots: Inventory[]) {

    // Set all updated slots to loading status
    let slotNumbers = updatedSlots.filter(tag => this.slots.find(slot => (slot.slotNumber === tag.antenna) && (slot.slotNumber !== this.reservedPosition)));
    slotNumbers.forEach(slotNo => this.slots.find(slot => slot.slotNumber === slotNo.antenna).slotState = SlotStates.LOADING);
  }

  // Updates the slots when the reader output changes
  public async setBoxObservedContents(updatedSlots: Inventory[]) {

    // Query the server for the tags that are incorrectly stored.
    let notCorrectlyStoredTags = this.filterTagsNotCorrectlyStored(updatedSlots);
    let tagsIdentity = notCorrectlyStoredTags.length > 0 ? await Http_PostTagsIdentity(notCorrectlyStoredTags) : null;

    // Poll the observed uids
    for (var s in updatedSlots) {

      // Ignore slot reserved for box tag
      if (updatedSlots[s].antenna !== this.reservedPosition) {

        // Find index of slot to update
        let index = this.slots.findIndex(posn => posn.slotNumber === updatedSlots[s].antenna);
        // Set observed UID
        if (updatedSlots[s].hasOwnProperty('UID')) {
          // Tag is present
          this.slots[index].setObservedUid(updatedSlots[s].UID[0]);
          // If tag is in db
          if (tagsIdentity && tagsIdentity.hasOwnProperty('Tags')) {

            let tagIdentidy = tagsIdentity.Tags.find(cont => cont !== null && cont.Uid === updatedSlots[s].UID[0]);
            // Set the observed container
            tagIdentidy ? this.slots[index].setObservedContainer(tagIdentidy) : this.slots[index].observedContainer = null;
          }
        } else {
          // Slot is empty
          this.slots[index].setObservedUid('');
        }
      }
    }
  }

  public async updateAllSlots() {

    for (var slot in this.slots) {

      if (this.slots[slot].slotNumber !== this.reservedPosition) {

        // Update State
        await this.slots[slot].updateSlotState();
      }
    }
  }

  // Filter array for tags that are present and not correctly stored
  private filterTagsNotCorrectlyStored(tags: Inventory[]): Inventory[] {

    // Find all tags that are present
    let presentTags = tags.filter(slot => slot.hasOwnProperty('UID') && slot.UID.length !== 0);
    // Filter present tags by checking their found uid is equal to their recorded uid
    return presentTags.filter(tag => this.slots.find(slot => slot.slotNumber === tag.antenna && (slot.getRecordedUid() !== tag.UID[0])));
  }
}