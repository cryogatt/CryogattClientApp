import { inject } from 'aurelia-dependency-injection';
import { useView } from 'aurelia-templating';
import { BoxSlotsScannerStorageOperations } from '../../../reader/storage-operations/box-slots-scanner-storage-operations';
import { ReaderType } from '../../../reader/reader-types';
import { ReaderService } from '../../../auth/reader-service';
import { Http_GetItems } from '../../../api/server';
import { GenericBoxReader } from '../generic-box-reader';
import { BoxStates } from '../../../reader/data-structures/box-states';
import { Server_ConvertToPicklist } from '../../../api/json-map';

@inject(GenericBoxReader)
@useView('../generic-box-reader.html')
export class StorageBoxSlotsScanAgainestList {

  // Generic display for box
  public boxDisplay: GenericBoxReader;
  // List of items to find
  public listItems: any;

  private storageOperations: BoxSlotsScannerStorageOperations;

  constructor(genericBoxDisplay: GenericBoxReader) {

    this.boxDisplay = genericBoxDisplay;
  }

  async activate() {

    this.boxDisplay.loading = true;

    await this.refreshList();

    // Start the reader on startup
    await this.startReader();
  }

  // Upon leaving the page
  async deactivate() {

    await ReaderService.stopPollingReader();
  }

  private async refreshList() {

    // TODO rethink this as it leaves dependency on this only working with the pick list
    var data = await Http_GetItems('picklist');
    this.listItems = Server_ConvertToPicklist(data);
  }

  public confirm() {

    this.boxDisplay.confirm();
  }

  public update() {

    this.boxDisplay.update();
  }

  public register() {

    this.boxDisplay.registerBox();
  }

  // Initialise reader and setup internal array
  async startReader() {

    this.storageOperations = new BoxSlotsScannerStorageOperations(ReaderType.CRYOGATT_R10101);

    this.boxDisplay.storageOperations = this.storageOperations;

    await this.storageOperations.start();

    this.boxDisplay.slots = [];

    // Load box data for UI when finding storage item
    this.storageOperations.fsm.on(BoxStates.KNOWN_BOX_SIG, (from: BoxStates) => {

      this.boxDisplay.loadBoxData();
    });
    // Load box data for UI when finding storage item
    this.storageOperations.fsm.on(BoxStates.UNKNOWN_BOX_SIG, (from: BoxStates) => {

      this.boxDisplay.getParents();
    });
    // Make the display clear when a box is removed
    this.storageOperations.fsm.on(BoxStates.NO_BOX_SIG, (from: BoxStates) => {

      this.boxDisplay.clearDisplay();
    });

    // Start polling reader
    ReaderService.startPollingReader(await this.pollReader.bind(this), 10500);
  }

  // On loop
  async pollReader() {

    // Call the assignment operation - TODO remove hardcoded required items parameter
    await this.storageOperations.scanAgainestList(this.listItems);

    // Deep copy required to trigger the binding
    var deepCopy = [];
    var antennaNo: number = 0;

    // Setup array to the square root of number of antennas of the reader - means all readers/boxes have equal length of columns & rows (square) and set all states to default
    for (var coulmnNo: number = 0; coulmnNo < Math.sqrt(this.storageOperations.box.slots.length); coulmnNo++) {

      var row = [];
      // for every row
      for (var rowNo: number = 0; rowNo < Math.sqrt(this.storageOperations.box.slots.length); rowNo++) {

        if (this.storageOperations.box.slots.length > antennaNo) {

          row.push(this.storageOperations.box.slots[antennaNo++]);
        }
      }
      deepCopy.push(row);
    }

    // Set the array values to that found on the operation
    this.boxDisplay.slots = deepCopy;

    this.boxDisplay.storageOperations = this.storageOperations;
    // Set the title to the status of the box
    this.boxDisplay.title = this.storageOperations.getBoxStatus();
    // Set the subtitle to the status of the samples
    this.boxDisplay.subtitle = this.storageOperations.getSlotsStatus();
    // Set variable to enable button
    this.boxDisplay.canUpdateDb = this.storageOperations.canUpdateDb;
    // Set the priority of the storage option
    this.boxDisplay.storageOption = this.storageOperations.priority;

    // Check for update to db
    if (this.boxDisplay.updated) {

      // Refresh internal copy of the pick list
      await this.refreshList();
      // Check if any items are are on the list
      this.storageOperations.setListItemsState(this.listItems);
      // Re-evaluate the operation priority
      this.storageOperations.resetPriority();
      // Reset variable
      this.boxDisplay.updated = false;
    }
  }
}