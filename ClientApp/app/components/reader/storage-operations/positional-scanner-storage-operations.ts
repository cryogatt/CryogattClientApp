import Readertypes = require("../reader-types");
import ReaderType = Readertypes.ReaderType;
import Istorageoperations = require("./istorage-operations");
import IStorageOperations = Istorageoperations.IStorageOperations;
import Server = require("../../api/server");
import Jsonmap = require("../../api/json-map");
import Reader = require("../../api/reader");
import Http_GetItems = Server.Http_GetItems;
import * as toastr from 'toastr';
import Positionalscanner = require("../scanner/positional-scanner");
import PositionalScanner = Positionalscanner.PositionalScanner;
import { Inventory } from "../data-structures/inventory";
import Containerstates = require("../data-structures/container-states");
import ContainerStates = Containerstates.ContainerStates;
import { Http_GetTagIdentTypeDesc } from "../../api/server";

export class PositionalScannerStorageOperations extends PositionalScanner implements IStorageOperations {

    newSample: Map<string, number> = new Map<string, number>();
    previousScan: any[];
    change: boolean;

    status: string = "";
    canUpdateDb: boolean = false;
    foundItems: any[] = [];

    public containerStates: ContainerStates[] = [];

   /* private foundItemsNotInDb: Map<string, ContainerStates> = new Map<string, ContainerStates>();*/

    constructor(readerId: ReaderType) {

        super(readerId);
        this.status = "Please scan an item";
    }

    // Initialise reader & set properties
    public async start() {

        await this.init();

    }


    async assignmentTenByOne(requiredItems: string[]) {

        // Only scan if database cannot be updated
        if (!this.canUpdateDb) {

            // Scan the reader
            await this.scan();

            // If a change since last read has been detected
            if (this.change) {

                this.setChange(false);
                this.foundItems = [];

                this.canUpdateDb = true;
                // Filter out the missing tags
                var newTags: Inventory[] = this.previousScan.filter(inv => inv.hasOwnProperty("UID") && inv.UID.length !== 0);

                // Query the server for all new tags Identity
                var tagIdentity = newTags.length > 0 ? await Server.Http_GetTagsIdentity(newTags) : null;

                this.containerStates = [];
                // Build internal array that matches the array of antennas
                for (var antennaNo: number = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {
                    this.containerStates.push(ContainerStates.DEFAULT);

                }


                // For every antenna/position where a slot has changed
                for (var slot in this.previousScan) {

                    var position = this.previousScan[slot];

                    //If no tags on slot
                    if (!position.hasOwnProperty("UID") && position.UID.length !== 0) {

                        this.containerStates[this.previousScan[slot].antenna - 1] = ContainerStates.DEFAULT;
                        continue;
                    }

                    // For every tag found on that antenna
                    for (var tag in this.previousScan[slot].UID) {

                        var tagUid = this.previousScan[slot].UID[tag];

                        // Determine if the tag is found in db
                        var recognized: boolean = (tagIdentity.Tags.find(tag => tag !== null && tag.Uid === tagUid) !== undefined);

                        if (!recognized) {

                            //var foundTag = this.newSample.get(tagUid);
                            //if (foundTag !== undefined) {
                            //    this.containerStates[position.antenna - 1] = foundTag;
                            //    continue;
                            //}


                            // Read the first (only) read tags control block for ident
                            var tagIdent = await Reader.Reader_Ident(this.reader.readerId, tagUid, position.antenna)
                                .catch(error => {

                                    toastr.error("Item moved while trying to interrogate its ident!");
                                    this.status = "Error occurred!";

                                    // throw error;
                                }
                                );

                            // Query the database to determine what the ident is
                            var tagType = await Http_GetTagIdentTypeDesc(tagIdent.Ident)
                                .catch(error => {

                                    toastr.error(error);
                                    throw error;
                                }
                                );

                            // If type recongised
                            if (tagType !== undefined) {

                                // If the ident (tag) is the one we're looking for (required)
                                if (requiredItems.find(type => type === tagType)) {

                                    this.status = tagType + " detected in position " + (position.antenna);

                                    this.containerStates[position.antenna - 1] = ContainerStates.UNFILLED;

                                    // Set the sample UID and ident in memory
                                    this.newSample.set(tagUid, parseInt(tagIdent.Ident, 16));

                                } else {

                                    this.containerStates[position.antenna - 1] = ContainerStates.ERROR;
                                    this.status = "Wrong type of item: " + tagType;
                                    this.newSample.set(tagUid, -1);
                                    //this.canUpdateDb = false;
                                }
                            } else {

                                this.containerStates[position.antenna - 1] = ContainerStates.INVAILD;
                                this.status = "RFID Tag not recognised!";
                                this.newSample.set(tagUid, -1);
                            }

                           
                        }
                        else {

                            this.containerStates[position.antenna - 1] = ContainerStates.FILLED;
                            var resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags.find(tag => tag !== null && tag.Uid === tagUid));
                            resp.position = position.antenna;
                            this.status = resp.description + " already in database!";
                            this.foundItems[position.antenna - 1] = resp;

                        }
                    }
                }
            }
        }

    }
    // Entry of new Containers
    async assignment(requiredItems: string[]) {

        // Only scan if database cannot be updated
        if (!this.canUpdateDb) {

            // Scan the reader
            await this.scan();

            // If a change since last read has been detected
            if (this.change) {

                this.setChange(false);

                // Filter out the missing tags
                var newTags: Inventory[] = this.changedSlots.filter(inv => inv.hasOwnProperty("UID") && inv.UID.length !== 0);

                // Query the server for all new tags Identity
                var tagIdentity = newTags.length > 0 ? await Server.Http_GetTagsIdentity(newTags) : null;

                // For every antenna/position where a slot has changed
                for (var slot in this.changedSlots) {

                    var position = this.changedSlots[slot];

                    //If no tags on slot
                    if (!position.hasOwnProperty("UID") && position.UID.length !== 0) {

                        this.containerStates[this.changedSlots[slot].antenna - 1] = ContainerStates.DEFAULT;
                        continue;
                    }

                    // For every tag found on that antenna
                    for (var tag in this.changedSlots[slot].UID) {

                        var tagUid = this.changedSlots[slot].UID[tag];

                        // Determine if the tag is found in db
                        var recognized: boolean = (tagIdentity.Tags.find(tag => tag !== null && tag.Uid === tagUid) !== undefined);

                        if (!recognized) {

                            // Read the first (only) read tags control block for ident
                            var tagIdent = await Reader.Reader_Ident(this.reader.readerId, tagUid, position.antenna)
                                .catch(error => {

                                    toastr.error("Item moved while trying to interrogate its ident!");
                                    this.status = "Error occurred!";
                                    throw error;
                                }
                                );

                            // Query the database to determine what the ident is
                            var tagType = await Http_GetTagIdentTypeDesc(tagIdent.Ident)
                                .catch(error => {

                                    toastr.error(error);
                                    throw error;
                                }
                                );

                            // If type recongised
                            if (tagType !== undefined) {

                                // If the ident (tag) is the one we're looking for (required)
                                if (requiredItems.find(type => type === tagType)) {

                                    this.status = tagType + " detected in position " + (position.antenna);

                                    this.containerStates[position.antenna - 1] = ContainerStates.UNFILLED;

                                    // Set the sample UID and ident in memory
                                    this.newSample.set(tagUid, parseInt(tagIdent.Ident, 16));
                                    this.canUpdateDb = true;
                                } else {

                                    this.containerStates[position.antenna - 1] = ContainerStates.ERROR;
                                    this.status = "Wrong type of item: " + tagType;
                                    this.canUpdateDb = false;
                                }
                            } else {

                                this.containerStates[position.antenna - 1] = ContainerStates.INVAILD;
                                this.status = "RFID Tag not recognised!";
                            }
                        } else {

                            this.containerStates[position.antenna - 1] = ContainerStates.FILLED;
                            var resp = Jsonmap.Server_ConvertToTagIdentity(tagIdentity.Tags.find(tag => tag !== null && tag.Uid === tagUid));
                            this.status = resp.description + " already in database!";
                        }
                    }
                }
            }
        }
    }

    scanAgainestList(list: any[], listItemsParents: any[], requiredItems: string[]): void {

        toastr.error("Whoops! This readers does not support this operation.");
    }

    bookingInOut(requiredItems: any[]): void {

        toastr.error("Whoops! This readers does not support this operation.");
    }
}