import Bulkscanner = require("../scanner/bulk-scanner");
import BulkScanner = Bulkscanner.BulkScanner;
import Readertypes = require("../reader-types");
import ReaderType = Readertypes.ReaderType;
import Istorageoperations = require("./istorage-operations");
import IStorageOperations = Istorageoperations.IStorageOperations;
import Server = require("../../api/server");
import Jsonmap = require("../../api/json-map");
import Reader = require("../../api/reader");
import Http_GetItems = Server.Http_GetItems;
import * as toastr from 'toastr';
import { Http_GetTagIdentTypeDesc } from "../../api/server";

export class BulkScannerStorageOperations extends BulkScanner implements IStorageOperations {

    status: string = "Please scan items to begin";
    canUpdateDb: boolean = false;
    foundItems: any[] = [];
    newSample: Map<string, number> = new Map<string, number>();

    constructor(readerId: ReaderType)
    {
        super(readerId);
    }

  public async start() {

    // Initialise reader & set properties
    await this.init();
  }

    // Entry of new Containers
    async assignment(requiredItems: string[]) {

        // Scan the reader
        await this.scan();

        // If a change since last read has been detected
        if (this.change) {

            this.setChange(false);

            // If only one new tag has been read
            if (this.newTags[0].UID.length === 1) {

                // Query the server for the tags Identity
                const tagIdentity = await Server.Http_GetTagsIdentity(this.newTags);

                // Determine if the tag is found in db
                const recognized: boolean = tagIdentity.Tags[0] !== null;

                if (!recognized) {

                      // Read the first (only) read tags control block for ident
                    const tagIdent = await Reader.Reader_Ident(this.reader.readerId, this.newTags[0].UID[0]).catch(error => {

                        console.log(error);
                        toastr.warning("Item removed too quickly!");
                    });

                    if (tagIdent != undefined) {

                      // Query the database to determine what the ident is
                      var tagType = await Http_GetTagIdentTypeDesc(tagIdent.Ident);
                      // If type recongised
                      if (tagType !== undefined) {
                        // If the ident (tag) is the one we're looking for (required)
                        if (requiredItems.find(type => type === tagType)) {

                          this.status = tagType + " Detected";

                          // Set the sample UID and ident in memory
                          this.newSample.set(this.newTags[0].UID[0], parseInt(tagIdent.Ident, 16));
                          this.canUpdateDb = true;
                        } else {

                          this.status = "Wrong type of Container presented: " + tagType;
                          this.canUpdateDb = false;
                        }
                      } else {

                        this.status = "RFID Tag not recognised!";
                      }
                    } else {

                      this.clear();
                    }
                } else {

                  var resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags[0]);
                  this.status = resp.description + " already in database!";
              }

            } else if (this.previousScan[0].UID.length === 0) {

                this.status = "Please present the tagged item to the Reader";
            } else {

              this.status = "Items must be read individually";
            }
        }
    }

    // Used for operations where items read need to be compared to list i.e Pick List
    async scanAgainestList(list: any[], listItemsParents: any[], requiredItems: string[], newParentItems?: any[]) {

        // Scan the reader
        await this.scan();

        // If a change since last read has been detected
        if (this.change) {

          // Query the server for the tags Identity
          var tagIdentities = await Server.Http_GetTagsIdentity(this.newTags);

          for (var tag in tagIdentities.Tags) {

                // Determine if the tag is found in db
                var recognized: boolean = tagIdentities.Tags[tag] !== null;

                // Determine if new read items are on the list and make them selected
                if (recognized) {

                  var found: boolean = false;
                    // Foreach item on the list
                    for (var item in list) {

                        //  If item is on the list
                        if (tagIdentities.Tags[tag].Uid === list[item].uid) {

                          // Select item on table
                          list[item].$isSelected = true;
                          found = true;
                          this.foundItems.push(tagIdentities.Tags[tag]);
                          break;
                        }
                        // Is tag parent of the item in the list?
                        else if (this.tagIsParent(tagIdentities.Tags[tag].Uid, listItemsParents)) {

                          found = true;
                          this.foundItems.push(tagIdentities.Tags[tag]);
                          break;
                        }
                        // Is the tag a child of the item on the list?
                        else if (await this.tagIsChild(tagIdentities.Tags[tag].Uid, list)) {

                          found = true;
                          this.foundItems.push(tagIdentities.Tags[tag]);
                          break;
                        }
                        // Are there any additional new parent items to be scanned
                        else if (newParentItems) {

                          if (newParentItems.findIndex(type => type === tagIdentities.Tags[tag].ContainerType) !== -1) {

                              found = true;
                              this.foundItems.push(tagIdentities.Tags[tag]);
                              break;
                          }
                        }
                    }

                    if (!found) {

                      toastr.error("Item not on the list");
                    }
                    if (!this.canUpdateDb) {

                        // Have all of the secondary storage items been read?
                      if (this.requireItemsFound(requiredItems)) {

                          // Have any items from the list been scanned
                          if (this.foundItems.some(tag => list.findIndex(item => item.uid === tag.Uid) !== -1)) {

                            this.canUpdateDb = true;
                            this.status = "Please select the confirm button to continue";
                          }
                        }
                    }
                } else {

                    toastr.error("Item Not Recognised! Please use the assignment operation to register the item in the database");
                    break;
                }
            }

          this.setChange(false);
        }
    }

    // Booking of Samples in & out of storage 
    async bookingInOut(requiredItems: any[]) {
        
        // Scan the reader
        await this.scan();

        // If a change since last read has been detected
        if (this.change) {

            this.setChange(false);

            // Query the server for the tags Identity
            var tagIdentities = await Server.Http_GetTagsIdentity(this.newTags);

            for (var tag in tagIdentities.Tags) {

                // Determine if the tag is found in db
                var recognized: boolean = tagIdentities.Tags[tag] !== null;

                if (recognized) {

                    // If not already on list add it
                    if (!this.foundItems.find(item => item.Uid === tagIdentities.Tags[tag].Uid)) {

                        var item = tagIdentities.Tags[tag];
                        // Make primary samples selected - TODO Replace with a call for primary container types to db
                        if (tagIdentities.Tags[tag].ContainerType === 'Vial' || tagIdentities.Tags[tag].ContainerType === 'Straw') { 

                          item.$isSelected = true;
                        }
                        this.foundItems.push(item);
                    }
                } else {

                    toastr.error("Item Not Recognised! Please use the assignment operation to register the item in the database");
                    break;
                }
            }

            if (!this.canUpdateDb) {

                // Have all of the storage items been read?
                if (this.requireItemsFound(requiredItems)) {
                  
                    this.canUpdateDb = true;
                    this.status = "Please select the Store/Withdraw button to store/remove selected samples";                    
                }
            }
        }
    }

    async scanForKnownItems() {

      await this.scan();

      if (this.change) {
        
        // Query the server for the tags Identity
        var tagIdentities = await Server.Http_GetTagsIdentity(this.newTags);

        if (tagIdentities.hasOwnProperty('Tags')) {

          for (var tag in tagIdentities.Tags) {

            // Determine if the tag is found in db
            var recognized: boolean = tagIdentities.Tags[tag] !== null;

            // Determine if new read items are on the list and make them selected
            if (recognized) {

              this.foundItems.push(tagIdentities.Tags[tag]);
              this.canUpdateDb = true;
            } else {

              toastr.warning("Item not in database!");
            }
          }
        }
        this.setChange(false);
      }
    }

    // Determines if all of the storage items been read
    private requireItemsFound(items: any[]): boolean {

        // Loop through the storage items required and determine if all have been found
        for (var requiredItem of items) {

            var noOfRequiredItem = this.foundItems.filter(it => it.ContainerType === requiredItem).length;
            // If only one of the particular item has been read
            if (noOfRequiredItem === 1) {

                continue;
            }
            // If more than one of the particular item has been read
            else if (this.foundItems.filter(it => it.ContainerType === requiredItem).length > 1) {

              toastr.error("Detected too many of type ", requiredItem);
              return false;
            }
            // If none of this particular item has been found
            else if (this.foundItems.filter(it => it.ContainerType === requiredItem).length === 0) {

              if (requiredItem === 'Sample') {

                // TODO Replace with a call for primary container types to db
                if (this.foundItems.filter(it => it.ContainerType === 'Vial' || it.ContainerType === 'Straw').length !== 0) {
                  
                  continue;
                } else {
                  
                  this.status = "Please scan a " + requiredItem;
                  return false;
                }
              } 
              this.status = "Please scan a " + requiredItem;
              return false;
            }
        }
        return true;
    }

    // Determines if a tag is the child of the item on the list
    private async tagIsChild(tagUid: string, list: any[]): Promise<boolean> {

        for (var item in list) {

            // Get the items stored within the item on the list
            var containerChildren = await Http_GetItems("Containers?UIDS=" + list[item].uid);
            for (var children in containerChildren.Containers) {

                if (containerChildren.Containers[children].Uid === tagUid) {

                    this.status = "Detected " + containerChildren.Containers[children].Description;
                    return true;
                }
            }
        }
        return false;
    }

    //  Determines if a tag is a parent of an item on the list?
    private tagIsParent(tagUid: string, allListParents: any[]): boolean {

        for (var itemsAncestory in allListParents) {

            for (var parent in allListParents[itemsAncestory]) {

                if (allListParents[itemsAncestory][parent].uid === tagUid) {

                    this.status = "Detected " + allListParents[itemsAncestory][parent].name;
                    return true;
                }
            }
        }
        return false;
    }
}