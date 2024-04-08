import { IStorageReaderOperations } from "../istorage-reader-operations";
import { ReaderType } from "../../../reader/reader-types";
import { ReaderService } from "../../../auth/reader-service";
import { Http_GetSingleTagIdentity,  Http_GetItems } from "../../../api/server";
import { DialogController } from "aurelia-dialog";
import { Server_ConvertManyToMaterialExtended, Server_ConvertToTagIdentity } from "../../../api/json-map";
import { bindable, bindingMode } from "aurelia-framework";
import Containerstates = require("../../../reader/data-structures/container-states");
import ContainerStates = Containerstates.ContainerStates;
import Positionalscannerstorageoperations = require("../../../reader/storage-operations/positional-scanner-storage-operations");
import PositionalScannerStorageOperations = Positionalscannerstorageoperations.PositionalScannerStorageOperations;
import { MaterialBatch } from "../../materials/material";
import { autoinject, transient } from "aurelia-dependency-injection";
import { Container } from 'aurelia-framework';
import Server = require("../../../api/server");
import * as toastr from 'toastr';
import * as moment from 'moment';
import { TagIdentity } from "../../../reader/data-structures/tag-identity";

@transient()
@autoinject()
export class StorageTenByOneAssignment implements IStorageReaderOperations {

    public apiPath: string;
    public title: string = "Assignment using  10x1 reader";
    public items: any[] = [];
    public controller: DialogController;
    // Hardcoded for bulk reader
    private storageOperations: PositionalScannerStorageOperations;
    // Internal states
    private canUpdateDb: boolean = false;
    private itemIsScanned: boolean = false;
    private nameIsGiven: boolean = false;
    private primaryContainer: boolean = true;
    public loading: boolean = false;
    private noOfSlots: number = 1;
    private isInValid: boolean = true;

    // Label
    public label;
    // Slot binding
    @bindable({ defaultBindingMode: bindingMode.twoWay }) types: string[] = ['Viability Tested', 'Safety Duplication', 'Cryobank'];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) type: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containerStates: ContainerStates[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) material: MaterialBatch;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) materials: MaterialBatch[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) descriptions: string[] = [];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) batches: string[] = [];

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


    async activate(model) {
        
        if (!model) {

            await this.loadBatches();
            //this.initItem();

        } else {

            this.primaryContainer = model.primaryContainer;
            this.materials = model.materials;
            this.material = model.material;
        }
    }

    public async confirm() {
        if (this.storageOperations.newSample.size > 0) {

            this.CreateStoreVial();

            for (var i: number = 0; i < this.items.length; i++) {
                await Server.Http_AddItem(this.apiPath + '/' + this.type, this.items[i]).then(data => {
                    if (data) {

                        toastr.success(" successfully added position " + this.items[i].position);
                    }
                }).catch(error => {

                    // An error has occurred, e.g. no data
                    toastr.error(error);
                });
            }

            this.canUpdateDb = false;
        } else {

            this.controller.error("Unknown error");
        }
        // implement update db
        this.controller.ok();

    }

    private async CreateStoreVial() {
        var slots: any[] = [];
        this.storageOperations.newSample.forEach((value: number, key: string) => {
            if (value !== -1) {
                var item = this.storageOperations.previousScan.find(slot => slot.UID[0] === key);
                if (item !== undefined) {
                    var description = this.descriptions[item.antenna - 1];
                    if (description !== undefined) {
                        var data = new TagIdentity();

                        data.uid = key;
                        data.position = item.antenna;
                        data.description = this.descriptions[item.antenna - 1];
                        data.containerType = "Vial";
                        data.batchName = this.material.name;
                        data.tagIdent = value;
                        data.batchId = this.material.uid;

                        slots.push(data);

                    }
                }
            }
            this.items = slots;
        })
     }



        //tagIdentity.uid = item.Uid;
        //tagIdentity.position = item.Position;
        //tagIdentity.description = item.Description;
        //tagIdentity.containerType = item.ContainerType;
        //tagIdentity.batchName = item.BatchName;


        //for (var antennaNo: number = 0; antennaNo < this.storageOperations.newSample.size; antennaNo++) {
        //    var slotInv: Inventory = this.storageOperations.previousScan.find(slot => slot.antenna === this.storageOperations.newSample[antennaNo]);
        //    var description = this.descriptions[item.position-1];
        //    this.items[antennaNo].description = description;
        //    this.items[antennaNo].BatchId = this.material.uid;
        //    this.items[antennaNo].InceptDate = this.items[antennaNo].InceptDate !== null ? moment(new Date()).format("MM/DD/YYYY HH:mm") : "";
        //    this.items[antennaNo].TagIdent = this.storageOperations.newSample.get(item.uid); 
        //}


   // }

    async startReader() {
        this.loading = true;
        this.storageOperations = new PositionalScannerStorageOperations(ReaderType.CRYOGATT_AR101); // TODO - Remove hardcoded dependency on neck reader and replace with some method of a selection of a bulk reader

        await this.storageOperations.start();

        await ReaderService.startPollingReader(await this.pollReader.bind(this));

        this.apiPath = "TenByOneBookingOperations";
    }

    async stopReader() {

        // Call to stop polling the reader
        await ReaderService.stopPollingReader();

        this.loading = false;
    }


   
    // On loop
    async pollReader() {

        if (!this.canUpdateDb) {
            // Call the assignment operation - TODO remove hardcoded required items paramenter
            var data = await this.storageOperations.assignmentTenByOne(["Vial"]);

            //if (this.storageOperations.previousScan.length !== this.storageOperations.changedSlots.length) {
            //    this.loading = false;
            //}


            if (this.storageOperations.canUpdateDb) {
                this.noOfSlots = this.storageOperations.containerStates.length;

                var item: any;
                // Deep copy required to trigger the binding
                var deepCopy: ContainerStates[] = [];


                this.batches = [];
                var deepCopyDescriptions:string[] = [];



                for (var antennaNo: number = 0; antennaNo < this.noOfSlots; antennaNo++) {


                    deepCopy.push(this.storageOperations.containerStates[antennaNo]);

                    item = this.storageOperations.foundItems[antennaNo];
                    if (item !== undefined) {
                        this.batches.push(item.batchName);
                    }
                    else {
                        this.batches.push(null);
                    }

                    var fdesc = item == undefined ? "" : item.description;
                    if (fdesc.length > 0 && deepCopy[antennaNo] != ContainerStates.DEFAULT) {
                        deepCopyDescriptions.push(fdesc);
                    }
                    else if (deepCopy[antennaNo] == ContainerStates.DEFAULT) {
                        deepCopyDescriptions.push("");
                    }
                    else {
                        fdesc = this.descriptions == undefined || this.descriptions[antennaNo] == undefined ? fdesc : this.descriptions[antennaNo];
                        deepCopyDescriptions.push(fdesc);
                    }

                }

                // Set the array values to that found on the operation
                this.containerStates = deepCopy;
                this.descriptions = deepCopyDescriptions;
                this.loading = false;
                this.isInValid = this.CheckIsInValid();
                this.storageOperations.canUpdateDb = false;
            }
        }
    }


    private async loadBatches() {

        await Http_GetItems("Materials").then(data => {

            if (data) {

                this.materials = Server_ConvertManyToMaterialExtended(data);
                this.materials = this.materials.reverse();
            }
        }).catch(error => {

            console.log(error);
            return false;
        });
    }

    async initItem() {
            var data = await this.storageOperations.assignment(["Vial"]);

            this.noOfSlots = this.storageOperations.containerStates.length;

            var item: any;
            // Deep copy required to trigger the binding
            var deepCopy: ContainerStates[] = [];
            var deepCopydescriptions: string[] = [];
            var deepCopybatches: string[] = [];
            for (var antennaNo: number = 0; antennaNo < this.noOfSlots; antennaNo++) {
                this.descriptions[antennaNo]="";
                deepCopy.push(this.storageOperations.containerStates[antennaNo]);

                item = this.storageOperations.foundItems[antennaNo];
                if (item !== undefined) {
                    deepCopydescriptions.push(item.description);
                    deepCopybatches.push(item.batchName);
                }
                else {
                    deepCopydescriptions.push('');
                    deepCopybatches.push(null);
                }
                // Clear the barcode if not an unfilled vial or empty slot to prevent the wrong barcode being left behind
                if (!(this.storageOperations.containerStates[antennaNo] === ContainerStates.UNFILLED || this.storageOperations.containerStates[antennaNo] === ContainerStates.DEFAULT)) {

                   this.batches
                }
            }

            // Set the array values to that found on the operation
            this.containerStates = deepCopy;
            this.descriptions = deepCopydescriptions;
            this.batches = deepCopybatches;
            // Set the title to the status of the operation
            //this.title = this.storageOperations.status;

            this.canUpdateDb = this.storageOperations.canUpdateDb;
            this.isInValid = this.CheckIsInValid();
    }
    async initItem_old() {


        var slot: any;
        if (this.primaryContainer) {

            for (var antennaNo: number = 0; antennaNo < this.storageOperations.changedSlots.length; antennaNo++) {

                slot = this.storageOperations.changedSlots[antennaNo];

                if (this.containerStates[slot.antenna-1] == 2) {

                    //var tagIdentity = new tagIdentity();

                    //tagIdentity.uid = slot.Uid[0];
                    //tagIdentity.position = slot.antenna + 1;
                    //tagIdentity.description = this.descriptions[slot.antenna - 1];
                    //tagIdentity.containerType = this.type;
                    //tagIdentity.batchName = this.material;


                    // Get the record of the parent
                    await Http_GetSingleTagIdentity(slot.UID[0]).then(data => {

                        if (data) {
                            data.Uid = slot.UID[0];
                            data.Position = slot.antenna;
                            data.Description = this.descriptions[slot.antenna - 1];
                            data.ContainerType = "Vial";
                            data.BatchName = this.material.name;

                            this.items.push(Server_ConvertToTagIdentity(data));
                        }
                    }).catch(error => {

                        // An error has occurred, e.g. no data, or invalid field values
                        toastr.error(error);
                    });
                }
            }
            //this.apiPath = "BoxBookingOperations?STORE";
            this.apiPath = "BookingOperations/";
        }
    }



        


    // Upon pressing enter
    handleKeyPress(evt) {
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);

        if (/^[a-zA-Z0-9\-\_ ]$/i.test(charStr)) {
            this.isInValid = this.CheckIsInValid();
            return true;
        } else {
            return false;
        }
    }

    CheckIsInValid() {
        if (this.containerStates == undefined)
            return true;
        for (var antennaNo: number = 0; antennaNo < this.noOfSlots; antennaNo++) {

            if (this.containerStates[antennaNo] == 2 && this.descriptions[antennaNo].length < 3 || this.containerStates[antennaNo] > 2) {
                return true;
            }
        }

        return false;
    }

    //hasDuplicates() {

    //    var names: string[] = [];


    //    for (var antennaNo: number = 0; antennaNo < this.noOfSlots; antennaNo++) {

    //        if (this.descriptions[antennaNo].length > 0) {
    //            names.push(this.descriptions[antennaNo]);
    //        }
    //    }


    //    var valuesSoFar = Object.create(null);
    //    for (var i = 0; i < names.length; ++i) {
    //        var value = names[i];
    //        if (value in valuesSoFar) {
    //            return true;
    //        }
    //        valuesSoFar[value] = true;
    //    }
    //    return false;
    //}
}