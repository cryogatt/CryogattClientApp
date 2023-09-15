import { GenericStorage } from '../../generic-storage';
import { ReaderService } from '../../../auth/reader-service';
import { ReaderType } from '../../../reader/reader-types';
import { BulkScannerStorageOperations } from '../../../reader/storage-operations/bulk-scanner-storage-operations';
import Server = require("../../../api/server");
import Jsonmap = require("../../../api/json-map");
import Istoragereaderoperations = require("../istorage-reader-operations");
import IStorageReaderOperations = Istoragereaderoperations.IStorageReaderOperations;

export class StorageBulkScanAgainestList implements IStorageReaderOperations {

  // Base list view model
  public storage: GenericStorage;
  
  public storageOperations: BulkScannerStorageOperations;
  // Secondary storage items required to be read for storage & withdrawal - ToDo Replace this with a call to server for storage outline
  public requiredItems: string[]; 
  // Parents of the items on list
  public containerParents: any[];
  // Optional new Parents for reallocation of storage - i.e Shipping, etc
  public newContainerParents: any[];

  // Constructor
  constructor(storage: GenericStorage, requiredItems, newParentItems?) {

    this.storage = storage;
    this.requiredItems = requiredItems;
    this.newContainerParents = newParentItems;

    this.storage.canViewHistory = false;

    // Initailise reader and start polling
    this.startReader();
  }

  async startReader() {

    // If there are items to be read        
    if (this.storage.items.length !== 0) {

      this.containerParents = [];
      for (var item of this.storage.items) {

        var parents = await Server.Http_GetContainerParents('ContainerParent', item.uid);
        var parentResp = Jsonmap.Server_ConvertToGenericContainer(parents);
        this.containerParents.push(parentResp);
      }

      this.storageOperations = new BulkScannerStorageOperations(ReaderType.CRYOGATT_NR002);

      await ReaderService.startPollingReader(await this.pollReader.bind(this));
    } else {

      this.storage.canUseReader = false;
    }
  }

  async stopReader() {

    // Call to stop polling the reader
    await ReaderService.stopPollingReader();

    this.storage.canUpdateDb = this.storageOperations.canUpdateDb = false;
  }

  // Main loop
  async pollReader() {
    
    await this.storageOperations.scanAgainestList(this.storage.items, this.containerParents, this.requiredItems, this.newContainerParents);
    this.storage.canUpdateDb = this.storageOperations.canUpdateDb;
    this.storage.subtitle = this.storageOperations.status;
    // If selected item not on page navigate to it - workaround for selectedItem not set due to aurelia pagination issue
    if (!this.storage.selectedItem && this.storage.canUpdateDb) {

      this.storage.selectedItem = this.storage.items.find(item => item.$isSelected);
      setTimeout(this.storage.navigateToSelected.bind(this.storage), 100);
    }
  }

  reset() {

    this.storageOperations.clear();
    this.storageOperations.foundItems = [];
    this.storageOperations.canUpdateDb = false;
  }

  public filterSelectedItems(): any[] {

    // Filter all required items and non required items (samples) that are selected
    var selectedItems = this.storageOperations.foundItems.filter(
      item => this.requiredItems.findIndex(requiredItem => requiredItem === item.ContainerType) !== -1 ||
        this.storage.items.findIndex(selectedItem => selectedItem.uid === item.Uid && selectedItem.$isSelected) !== -1);

    // Return null if there are no samples in list
    return selectedItems.find(
        item => this.requiredItems.findIndex(requiredItem => requiredItem === item.ContainerType) === -1) !==
      undefined
      ? selectedItems
      : null;
  }
}
