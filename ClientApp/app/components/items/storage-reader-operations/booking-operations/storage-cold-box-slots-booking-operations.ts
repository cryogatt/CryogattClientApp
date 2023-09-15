import { inject, autoinject } from 'aurelia-dependency-injection';
import { useView } from 'aurelia-templating';
import { BoxSlotsScannerStorageOperations } from '../../../reader/storage-operations/box-slots-scanner-storage-operations';
import { ReaderType } from '../../../reader/reader-types';
import { ReaderService } from '../../../auth/reader-service';
import { GenericBoxReader } from '../generic-box-reader';
import { BoxStates } from '../../../reader/data-structures/box-states';
import { Reader_GetBatteryLife, Reader_GetTemp } from '../../../api/reader';
import { DialogService } from 'aurelia-dialog';
import { StorageTempDialogue } from '../storage-temp-dialogue';
import { WarningDialogue } from '../warning-dialogue';

@autoinject()
@useView('../generic-box-reader.html')
export class StorageColdBoxSlotsBookingOperations {

    // Generic display for box
    public boxDisplay: GenericBoxReader;
    // Hardcoded for positional reader
    private storageOperations: BoxSlotsScannerStorageOperations;
    private noOfReads: number = 0;
    private dialogueOpen: boolean = false;
    private confirmedBatteryWarning: boolean = false;
    private confirmedLowTempWarning: boolean = false;

    public dialogService: DialogService;

    constructor(genericBoxDisplay: GenericBoxReader, dialogController: DialogService) {

        this.dialogService = dialogController;
        this.boxDisplay = genericBoxDisplay;
        this.boxDisplay.canViewTemperatureStats = true;
    }

    async bind() {

        this.boxDisplay.loading = true;

        // Start the reader on startup
        await this.startReader();

        this.boxDisplay.loading = false;
    }

    // Upon leaving the page
    async unbind() {

        await this.stopReader();
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

        this.storageOperations = new BoxSlotsScannerStorageOperations(ReaderType.CRYOGATT_R10102);

        this.boxDisplay.storageOperations = this.storageOperations;

        await this.storageOperations.start();

        this.boxDisplay.slots = [];

        // Load box data for UI when finding storage item
        this.storageOperations.fsm.on(BoxStates.KNOWN_BOX_SIG, (from: BoxStates) => {

            this.boxDisplay.loadBoxData();
        });
        // Load box data for UI when finding storage item
        this.storageOperations.fsm.on(BoxStates.UNKNOWN_BOX_SIG, (from: BoxStates) => {

            this.boxDisplay.setDefaultParents();
        });
        // Make the display clear when a box is removed
        this.storageOperations.fsm.on(BoxStates.NO_BOX_SIG, (from: BoxStates) => {

            this.boxDisplay.clearDisplay();
        });

        // Start polling reader
        await ReaderService.startPollingReader(await this.pollReader.bind(this));
    }

    async stopReader() {

        await ReaderService.stopPollingReader();
    }

    // On loop
    async pollReader() {

        // Call the booking operation
        await this.storageOperations.bookingInOut();

        this.noOfReads++;

        // Deep copy required to trigger the binding
        var deepCopy = [];
        var antennaNo: number = 0;

        // Setup array to the square root of number of antennas of the reader - means all readers/boxes have equal length of columns & rows (square) and set all states to default
        for (var columnNo: number = 0; columnNo < Math.sqrt(this.storageOperations.box.slots.length); columnNo++) {

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

        this.monitorHealthStats();
    }

    async monitorHealthStats() {

        if (this.noOfReads === 1 || this.noOfReads % 10 === 0) {

            this.monitorBatteryLife();
            this.monitorTemperature();
        }
    }

    async monitorBatteryLife() {

        var batteryLife = await Reader_GetBatteryLife(ReaderType.CRYOGATT_R10102);
        this.boxDisplay.batteryLife = batteryLife[0];

        if (batteryLife < 15) {

            this.dialogueOpen = true;
            // Launch a modal dialogue 
            if (this.confirmedBatteryWarning === false) {
                this.dialogService.open({ viewModel: WarningDialogue, model: { title: "Battery low!", subtitle: "Please place on charger" }, lock: true })
                    .whenClosed(result => {
                        this.confirmedBatteryWarning = true;
                        this.dialogueOpen = false;
                    }).catch(result => {

                        this.dialogueOpen = false;

                        // Handle error
                        console.log("Battery - dialog service error (catch)");
                    });
            }
        }
    }

    async monitorTemperature() {

        if (this.confirmedLowTempWarning === true) 
            return;

        if (this.dialogueOpen === true)
            return;

        var temps = await Reader_GetTemp(ReaderType.CRYOGATT_R10102);
        for (var temp of temps) {

            if (temp.Temperature < 0) {

                this.dialogueOpen = true;
                // Launch a modal dialogue 
                this.dialogService.open({ viewModel: WarningDialogue, model: { title: "Temperature low!", subtitle: "Please return to room temperature" }, lock: true })
                    .whenClosed(result => {
                        this.confirmedLowTempWarning = true;
                        this.dialogueOpen = false;
                    }).catch(result => {

                        this.dialogueOpen = false;

                        // Handle error
                        console.log("Temperature - dialog service error (catch)");
                    });
                break;
            }
        }
    }

    launchTemperatureStatsDlg() {

        // Launch a modal dialogue 
        this.dialogService.open({ viewModel: StorageTempDialogue, model: null, lock: false }).catch(result => {

            // Handle error
            console.log("Temperature - dialog service error (catch)");
        });
    }
}