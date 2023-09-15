import Ipostionalstoragescanner = require("./ipostional-storage-scanner");
import IPositionalStorageScanner = Ipostionalstoragescanner.IPositionalStorageScanner;
import Readertypes = require("../../reader-types");
import ReaderType = Readertypes.ReaderType;
import Genericreader = require("../../generic-reader");
import GenericReader = Genericreader.GenericReader;
import { TypeState } from 'TypeState';
import { Inventory } from "../../data-structures/inventory";
import { PositionalScanner } from "../positional-scanner";
import { Reader_Ident } from "../../../api/reader";
import { Http_GetSingleTagIdentity, Http_GetTagIdentTypeDesc, Http_GetParentPrimaryContainers } from "../../../api/server";
import { Slot } from "../../data-structures/slot";
import { SlotStates } from "../../data-structures/slot-states";
import { Server_ConvertToPrimaryContainers, Server_ConvertToTagIdentity } from "../../../api/json-map";
import { BoxStates } from "../../data-structures/box-states";
import { Box } from "../../data-structures/box";

// Handles the box and sets the recorded UID of the box contents
export class BoxPositionalStorageScanner extends PositionalScanner implements IPositionalStorageScanner {

    // State machine
    public fsm: TypeState.FiniteStateMachine<BoxStates>;

    public box: Box;

    private tagIdent: string;

    constructor(readerType: ReaderType) {

        // Initailise the reader
        super(readerType);

        // Construct the FSM with the inital state, in this case the box reader starts without a box found
        this.fsm = new TypeState.FiniteStateMachine<BoxStates>(BoxStates.NO_BOX_SIG);

        // Declare the valid state transitions to model your system - No box to different box states
        this.fsm.from(BoxStates.NO_BOX_SIG).to(BoxStates.KNOWN_BOX_SIG);
        this.fsm.from(BoxStates.NO_BOX_SIG).to(BoxStates.UNKNOWN_BOX_SIG);
        this.fsm.from(BoxStates.NO_BOX_SIG).to(BoxStates.BAD_TAG_SIG);

        // Box to no box, assumes a reading will occour before someone can switch boxes - reduces complexity
        this.fsm.fromAny(BoxStates).to(BoxStates.NO_BOX_SIG);
        this.fsm.from(BoxStates.NO_BOX_SIG).toAny(BoxStates);
        this.fsm.fromAny(BoxStates).toAny(BoxStates);

        // Declare listeners
        this.fsm.on(BoxStates.NO_BOX_SIG, (from: BoxStates) => {
          this.noBox();
        });

        this.fsm.on(BoxStates.BAD_TAG_SIG, (from: BoxStates) => {
          this.badTag();
        });

        this.fsm.on(BoxStates.BOX_CHANGED_SIG, (from: BoxStates) => {
          this.boxChanged();
        });

        this.fsm.onEnter(BoxStates.KNOWN_BOX_SIG, (from: BoxStates) => {
          this.keepPreviousScan = true;
          this.knownBox();
          // To satisfy condition - TODO maybe use this as opportunity to ensure the data is valid?
          return true;
        });

        this.fsm.onExit(BoxStates.KNOWN_BOX_SIG, (from: BoxStates) => {

          this.keepPreviousScan = false;
                   
          // To satisfy condition - TODO maybe use this as opportunity to ensure the data is valid?
          return true;
        });

        this.fsm.on(BoxStates.UNKNOWN_BOX_SIG, (from: BoxStates) => {
          this.unknownBox();
        });
    }

    public async initBoxScanner() {

      // Initialise reader settings
      await this.init();
      // Set default values for interal variables
      this.resetVariables();

      this.box = new Box(this.reader.antennaQuantity);
    }

    // Main loop
    protected async scanBox(): Promise<BoxStates> {

      // Update to the reserved slot?
      if (this.reservedPosnChanged()) {

        await this.setBoxState();
      }
      return this.fsm.currentState;
    }

    // Logic for determining box state
    private async setBoxState() {

      // If tag in allocated box position
      if (this.tagInBoxPosition()) {

        let tagInPosn = this.getTagInBoxPosition();
        // Tag is a box
        if (await this.tagIsBox(tagInPosn)) {

          // Set the box UID
          this.box.setUid(tagInPosn);

          // Has a box been read since program started 
          if (this.storageItem) {
            // Is it the same box that was read last time
            if (this.box.uid !== this.storageItem.uid) {
              // Reset internal variables if box has changed
              this.fsm.go(BoxStates.BOX_CHANGED_SIG);
            }
          } 
          await this.isKnownBox(tagInPosn) ? this.fsm.go(BoxStates.KNOWN_BOX_SIG) : this.fsm.go(BoxStates.UNKNOWN_BOX_SIG);         
        } else {

          this.fsm.go(BoxStates.BAD_TAG_SIG);
        }
      } else {

        // Condition incase state is already set
        if (this.fsm.currentState !== BoxStates.NO_BOX_SIG) {

          this.fsm.go(BoxStates.NO_BOX_SIG);
        }
      }
    }

    private boxChanged() {

      this.resetVariables();
      this.clear();
    }

    private noBox() {

      this.resetVariables();
    }

    private badTag() {

      this.resetVariables();
    }

    private unknownBox() {

      this.resetVariables();

      // Set the attributes of new box for assignment
      this.storageItem = { 'Uid': this.box.uid, 'TagIdent': parseInt(this.tagIdent, 16) };
    }

    protected async knownBox() {

      await this.updateBoxContents();
    }

    // Calls the database and sets the recorded uid of the slots
    public async updateBoxContents() {

      // Get all storage containers belonging to box
      let boxContents = await this.box.getBoxContentsfromDb();

      if (boxContents && boxContents.hasOwnProperty('PrimaryContainers')) {

        // Set the storage item contents 
        this.storageItemContents = Server_ConvertToPrimaryContainers(boxContents);
        // Set the recorded contents of the box
        this.box.setBoxRecordedContents(boxContents.PrimaryContainers);
        // Set the reserved slot for the box
        this.box.setReservedSlot();
        // Set the storage item to found
        this.storageItemFound = true;
      }
    } 

    // Has there been an update the reserved slot
    public reservedPosnChanged(): boolean {

      return (this.changedSlots.find(slot => slot.antenna === this.box.reservedPosition) !== undefined || this.previousScan.find(slot => slot.antenna === this.box.reservedPosition) === undefined);
    }

    // Is the box in the database?
    private async isKnownBox(boxUid: string): Promise<boolean> {

      var found: boolean = false;
      var box = await Http_GetSingleTagIdentity(boxUid).catch(error => {

        console.log(error);
        return false;
      });

      // Valid response
      if (box.hasOwnProperty('Tags'))
      {
        // Valid tag
        if (box.Tags[0] === null) {
          return false;
        }

        found = true;
        this.storageItem = Server_ConvertToTagIdentity(box.Tags[0]);
        
        if (this.storageItem.parentUidDescription.size > 0) {
          // Get the storage item parent
          var parent = await Http_GetSingleTagIdentity(this.storageItem.parentUidDescription.entries().next().value[0]).catch(error => { console.log(error); });

          // Set storage item parent
          if (box.Tags[0] !== null) {
            this.storageItemParent = Server_ConvertToTagIdentity(parent.Tags[0]);
          }
        }
      }

      return found;
    }

    // Is allocated slot for box taken?
    private tagInBoxPosition(): boolean {

      var slotInv: Inventory = this.changedSlots.find(slot => slot.antenna === this.box.reservedPosition);

      // Not in list
      if (slotInv === undefined || slotInv === null) { return false };
      // Has no uid property
      if (!slotInv.hasOwnProperty("UID")) { return false; }
      // Has more or less than one tag in position
      return (slotInv.UID.length === 1);
    }

    // Get the tag Uid in box position 
    private getTagInBoxPosition(): string {

      return this.changedSlots.find(slot => slot.antenna === this.box.reservedPosition).UID[0];
    }

    // Is the tag in the box slot a box
    private async tagIsBox(boxUid: string): Promise<boolean> {

      var isBox: boolean = false;
      // Read the first (only) read tags control block for ident
      var tagIdentResp = await Reader_Ident(this.reader.readerId, boxUid).catch(error => {

        console.log(error);        
        return false;
      });          

      // Valid response
      if (tagIdentResp.hasOwnProperty('Ident')) {

        this.tagIdent = tagIdentResp.Ident;
        // Is Ident set
        if (this.tagIdent === "00000000") {

          return false;
        }
        // Query the database to determine what the ident is
        var tagType = await Http_GetTagIdentTypeDesc(this.tagIdent).catch(error => {

          console.log(error);
          return false;
        });

          isBox = tagType === "Box";//TODO CHANGE BACK TO BOX!
      }

      return isBox; 
    }    

    // Resets variables to default;
    private resetVariables() {

      this.storageItemFound = false;
      this.storageItemContents = [];
      this.storageItem = undefined;

      this.emptySlots();
    }

    private emptySlots() {

      if (this.box) {
        // Set all slot states to empty - Assumes one slot per antenna
        for (var slot in this.box.slots) {

          this.box.slots[slot].setAsEmpty();
        }
      }
    }
    
    storageItem: any;
    storageItemFound: boolean;
    storageItemContents: any[];
    storageItemParent: any;
}