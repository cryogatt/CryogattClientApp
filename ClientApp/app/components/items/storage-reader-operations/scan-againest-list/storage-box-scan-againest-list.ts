import { Router } from 'aurelia-router';
import { inject } from 'aurelia-dependency-injection';
import { GenericStorage } from "../../generic-storage";
import { BoxPositionalStorageScanner } from '../../../reader/scanner/positional-storage-scanner/box-positional-storage-scanner';
import { ReaderType } from "../../../reader/reader-types";
import { BoxStates } from "../../../reader/data-structures/box-states";
import { ReaderService } from "../../../auth/reader-service";
import * as toastr from 'toastr';

@inject(Router)
export class StorageBoxScanAgainestList extends BoxPositionalStorageScanner {

  // Page navigation
  private theRouter: Router;
  static inject() { return [Router]; }

  public storage: GenericStorage;
    constructor(storage: GenericStorage, router: Router, readerType: ReaderType) {

        super(readerType);
    this.storage = storage;
    this.theRouter = router;

    // Start the reader on startup
    this.startReader();

    // Set initial subtitle
    this.storage.subtitle = "Place box containing pick list items on reader to begin";

    // Setup fsm listeners
    this.fsm.on(BoxStates.NO_BOX_SIG, (from: BoxStates) => {

      this.storage.subtitle = "Place box containing pick list items on reader to continue";
      // Redirect back to the pick list
      this.theRouter.navigate("picklist");
    }); 
    this.fsm.on(BoxStates.UNKNOWN_BOX_SIG, (from: BoxStates) => {

      toastr.warning("Box is not in database!");
      this.storage.subtitle = "Box is not in database!";
    });
    this.fsm.on(BoxStates.BAD_TAG_SIG, (from: BoxStates) => {

      toastr.error("Tag not recognised!");
      this.storage.subtitle = "Tag not recognised!";
    }); 
    this.fsm.on(BoxStates.KNOWN_BOX_SIG, (from: BoxStates) => {

      this.foundBox();
    });    
  }

  // Initialise reader and setup internal array
  async startReader() {

    await this.initBoxScanner();

    // Start polling reader
    await ReaderService.startPollingReader(await this.pollReader.bind(this), 10500);
  }

  // On loop
  private async pollReader() {

    // Scan the reader
    await this.scan();

    if (this.change) {

      // Scan the box 
      await this.scanBox();
      
      this.setChange(false);
    }
  }

  // Action when finding a known box
  private async foundBox() {

    if (await this.boxHasListItems()) {

      this.pickItems();
    } else {

      toastr.warning(this.storageItem.description + " does not contain items on the pick list");
      this.storage.subtitle = this.storageItem.description + " does not contain items on the pick list";
    }
  }

  // Determine if box contains any items on the list
  private async boxHasListItems(): Promise<boolean> {

    // Work around for co-routinue - waits for fsm to find the contents of the box
    while (!this.storageItemFound) {

      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("Waiting for data.." + this.storageItemFound);
    }

    // for every item on the pick list
    for (var it in this.storage.items) {

      // for every item in the box
      for (var cnts in this.storageItemContents) {
        // The uids match
        if (this.storageItemContents[cnts].uid === this.storage.items[it].uid) {

          return true;
        }
      }
    }
  }

  private pickItems() {

    toastr.success("Box containing pick list items detected");

    // Stop polling reader
    ReaderService.stopPollingReader();

    // Navigate to pick items page
    this.theRouter.navigate("boxSlotsScanAgainestList");
  }
}