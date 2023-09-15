import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { ReaderService } from '../../../auth/reader-service';
import Barcodesample = require("../barcode-sample");
import BarcodeSample = Barcodesample.BarcodeSample;
import Readertypes = require("../../../reader/reader-types");
import ReaderType = Readertypes.ReaderType;
import Positionalscannerstorageoperations = require("../../../reader/storage-operations/positional-scanner-storage-operations");
import PositionalScannerStorageOperations = Positionalscannerstorageoperations.PositionalScannerStorageOperations;
import Containerstates = require("../../../reader/data-structures/container-states");
import ContainerStates = Containerstates.ContainerStates;
import Server = require("../../../api/server");
import * as toastr from 'toastr';

var $ = require('jquery');

@transient()
@autoinject()
export class StorageBarcodeSampleAssignment {

    // Dialogue header
    public title: string;
    // Modal binding
    public controller: DialogController;
    // Hardcoded for positional reader
    private storageOperations: PositionalScannerStorageOperations;
    // Condition for updating database
    public canUpdateDb: boolean = false;
    // Barcode label
    public barcodeLbl;
    // Constructor
    constructor(dialogController: DialogController) {

      this.controller = dialogController;
    }

    // bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) barcodeSample: BarcodeSample;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containerStates: ContainerStates[];

    async bind() {

      // Start the reader on startup
      await this.startReader();
    }

    attached() {

      // Get access to user input label
      this.barcodeLbl = document.getElementById("barcodeLbl");
      this.barcodeLbl.focus();
    }

    // Update database
    public async confirm() {

      if (this.canUpdateDb) {

        if (this.storageOperations.newSample.size === 1) {

          // Set properties found from reader
          this.barcodeSample.uid = Array.from(this.storageOperations.newSample.keys())[0];
          this.barcodeSample.tagIdent = this.storageOperations.newSample.get(this.barcodeSample.uid);

          // Add to database
          await Server.Http_AddItem("BarcodeSamples", this.barcodeSample).then( data => {

            if (data) {

              toastr.success(this.barcodeSample.barcode + " successfully added.");
            }
          }).catch(error => {

            // An error has occurred, e.g. no data
            toastr.error(error);
          });
        } else {

          this.controller.error("Unknown error");
        }

        // implement update db
        this.controller.ok();
      }
    }

    // Initialise reader and setup internal array
    async startReader() {

      this.storageOperations = new PositionalScannerStorageOperations(ReaderType.CRYOGATT_SR012);

      await this.storageOperations.start();

      // Setup array to the same size as the number of antennas and set all states to default
      this.containerStates = [];
      for (var antennaNo: number = 0; antennaNo < this.storageOperations.reader.antennaQuantity; antennaNo++) {

        this.containerStates.push(ContainerStates.DEFAULT);
      }

      // Start polling reader
      await ReaderService.startPollingReader(await this.pollReader.bind(this));
    }

    // On loop
    async pollReader() {

      if (!this.canUpdateDb) {
        // Call the assignment operation - TODO remove hardcoded required items paramenter
        await this.storageOperations.assignment(["Vial"]);

        // Deep copy required to trigger the binding
        var deepCopy: ContainerStates[] = [];
        for (var antennaNo: number = 0; antennaNo < this.storageOperations.containerStates.length; antennaNo++) {

          deepCopy.push(this.storageOperations.containerStates[antennaNo]);

          // Clear the barcode if not an unfilled vial or empty slot to prevent the wrong barcode being left behind
          if (!(this.storageOperations.containerStates[antennaNo] === ContainerStates.UNFILLED || this.storageOperations.containerStates[antennaNo] === ContainerStates.DEFAULT)) {

            this.barcodeLbl.value = "";
          }
        }

        // Set the array values to that found on the operation
        this.containerStates = deepCopy;

        // Set the title to the status of the operation
        this.title = this.storageOperations.status;

        this.canUpdateDb = this.storageOperations.canUpdateDb;

      } else if (!this.barcodeSample) {

        this.title = "Please scan the barcode";

      } else if (this.barcodeSample.barcode) {

        this.title = "Press confirm to continue";
      }
    }

    // Upon pressing enter
    handleKeyPress(evt) {

      if (evt.keyCode === 13 && this.barcodeSample) {

        if (this.barcodeSample.hasOwnProperty('barcode') && this.barcodeSample.barcode) {

          this.confirm();
          evt.preventDefault();
        }
      } else {
        return true;
      }
    }

    // Input validation for the form
    validate(): Promise<any> {

        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    }
}