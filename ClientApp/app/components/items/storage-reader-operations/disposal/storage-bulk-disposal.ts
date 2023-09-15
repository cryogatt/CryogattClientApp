import { IStorageReaderOperations } from "../istorage-reader-operations";
import { BulkScannerStorageOperations } from "../../../reader/storage-operations/bulk-scanner-storage-operations";
import { ReaderType } from "../../../reader/reader-types";
import { ReaderService } from "../../../auth/reader-service";
import { Http_GetTagsIdentity } from "../../../api/server";
import * as toastr from 'toastr';
import { DialogController } from "aurelia-dialog";
import { bindable, bindingMode } from "aurelia-framework";
import { Slot } from "../../../reader/data-structures/slot";
import { ContainerStates } from "../../../reader/data-structures/container-states";
import { MaterialBatch } from "../../materials/material";
import { autoinject, transient } from "aurelia-dependency-injection";
import Server = require("../../../api/server");

@transient()
@autoinject()
export class StorageBulkDisposal implements IStorageReaderOperations {

    public apiPath: string;
    public title: string = "Please scan an item to begin";
    public item: any;
    public controller: DialogController;
    // Hardcoded for bulk reader
    private storageOperations: BulkScannerStorageOperations;
    // Internal states
    private canUpdateDb: boolean = false;

    // Slot binding
    @bindable({ defaultBindingMode: bindingMode.twoWay }) slot: Slot;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containerState: ContainerStates = ContainerStates.DEFAULT;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) material: MaterialBatch;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) materials: MaterialBatch[];

    // Constructor
    constructor(dialogController: DialogController) {

        this.controller = dialogController;
    }

    async bind() {

        await this.startReader();
    }

    async unbind() {

        await this.stopReader();
    }

    // Upon pressing enter
    public handleKeyPress(evt) {

        if (evt.keyCode === 13) {

            if (this.canUpdateDb) {

                this.confirm();
            }
        } else {
            return true;
        }
    }

    // Update database
    public async confirm() {

        console.log(this.canUpdateDb);

        if (this.canUpdateDb) {
            
            // Add to database
            Server.Http_AddItem("Disposal", this.item).then(data => {

                if (data) {

                    toastr.success(this.item.Description + " successfully disposed.");
                }

                // Close the dialogue with current settings to prevent reloading and manual sections
                this.controller.close(true);
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
            });
        }
    }

    async startReader() {

        this.storageOperations = new BulkScannerStorageOperations(ReaderType.CRYOGATT_NR002); // TODO - Remove hardcoded dependency on neck reader and replace with some method of a selection of a bulk reader

        await this.storageOperations.start();

        await ReaderService.startPollingReader(await this.pollReader.bind(this));
    }

    async stopReader() {

        // Call to stop polling the reader
        await ReaderService.stopPollingReader();
    }

    async pollReader() {

        if (!this.canUpdateDb) {

            // If reader has scanned item
            if (!this.storageOperations.canUpdateDb) {

                if (await this.validTagFound()) {
                    // Change state
                    this.containerState = ContainerStates.FILLED;
                    this.canUpdateDb = true;
                }
            }                
        } else {

            this.title = "Press Save to mark " + this.item.Description + " as disposed";
            this.canUpdateDb = true;
            this.stopReader();
        }
    }

    async validTagFound(): Promise<boolean> {

        // Scan the reader for new items
        if (await this.readerFoundNewItems()) {

            if (this.singleItemScanned()) {

                return await this.itemIsRecognised();
            }
        }
        return false;
    }

    // Ensure only one item has been scanned
    singleItemScanned(): boolean {

        if (this.storageOperations.newTags[0].UID.length === 1) {

            return true;
        }
        else if (this.storageOperations.previousScan[0].UID.length === 0) {

            this.title = "Please present the tagged item to the Reader";
        }
        else if (this.storageOperations.previousScan[0].UID.length > 1) {

            this.title = "Please scan the items individually";
        }

        return false;
    }

    async readerFoundNewItems(): Promise<boolean> {

        // Scan the reader
        await this.storageOperations.scan();

        // If a change since last read has been detected
        if (this.storageOperations.change) {

            this.storageOperations.setChange(false);

            return true;
        } else {

            return false;
        }
    }

    async itemIsRecognised(): Promise<boolean> {

        let recongised: boolean = false;
        // Query the server for the tags Identity
        await Http_GetTagsIdentity(this.storageOperations.newTags).then(data => {

            recongised = data.Tags[0] !== null;
            if (!recongised) {
                this.title = "Item is not in the database!";
                this.containerState = ContainerStates.INVAILD;
            } else {
                this.item = data.Tags[0];
            }
        }).catch(error => {

            console.log(error);
            toastr.warning(error);
        });
        return recongised;
    }
    
    initItem() {

        // Set the uid
        this.item.Uid = this.storageOperations.newTags[0].UID[0];
        this.apiPath += this.item.Uid;
    }
} 