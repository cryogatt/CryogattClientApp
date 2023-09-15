import { useView, inject, autoinject } from 'aurelia-framework';
import { Server_ConvertToGenericContainer } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';
import { Containers } from '../containers/containers';
import { Router } from 'aurelia-router';
import * as toastr from 'toastr';
import { ReaderService } from '../../auth/reader-service';
import { DialogService } from 'aurelia-dialog';
import Server = require("../../api/server");
//! For Neck Reader
import { StorageBulkScanAgainestList } from "../storage-reader-operations/scan-againest-list/storage-bulk-scan-againest-list";
import { StorageBulkDisposal } from '../storage-reader-operations/disposal/storage-bulk-disposal';

@useView('../generic-storage.html')
//@autoinject
@inject(GenericStorage, Containers, DialogService)
export class ContainerList {

    // Base list view model
    private storage: GenericStorage;
    private containers: Containers;

    public scanOperation: any;

    // Modal dialog service
    public dialogService: DialogService;

    public parentContainer: any;

    // Constructor
    constructor(storage: GenericStorage, containers: Containers, dialogService: DialogService) {
        this.storage = storage;
        this.containers = containers;
        this.dialogService = dialogService;
    }

    // Sets up the specific bindings for ContainerList
    async activate() {

        // General storage properties
        this.storage.apiPath = "Disposal";
        this.storage.storageType = 'container';
        this.storage.type_singular = "Storage";//TODO Sort propper names for this. Maybe types read out of database?
        this.storage.type_plural = "ContainerList";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("name", "Name");
        this.storage.schema.set("type", "Type");
        this.storage.schema.set("addedDate", "Added");

        // Set up container properties
        this.containers.containsTypeSingular = "Container";
        this.containers.containsTypePlural = "Containers";

        // Command presence
        this.storage.title = "Disposed Items";
        this.storage.canCreateItem = false;
        this.storage.createItemInfo = "Create Non RFID Enabled Containers such as Freezers, etc";
        this.storage.canAuditItems = false;
        this.storage.canEditItem = false;
        this.storage.canViewItem = false;
        this.containers.canAddContents = false;
        this.containers.canViewContents = false;
        this.containers.canViewAliquots = false;
        this.storage.canViewHistory = true;
        this.storage.canDisposeItems = true;

        await this.storage.fetch(this.storage.apiPath, Server_ConvertToGenericContainer);
    }

    dispose(previousResult?) {

        this.dialogService.open({ viewModel: /*StoragePositionalGenericAssignment*/ StorageBulkDisposal, model: previousResult, lock: false }).whenClosed(result => {
            if (!result.wasCancelled) {

                // Restart the operation unless cancelled
                this.dispose();
            }
            else {
                if (result.output) {

                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
            if (ReaderService.readerOn()) {

                ReaderService.stopPollingReader();
            }
        }).catch(result => {

            // Handle error
            toastr.error("An error occurred during the disposal process.")
            });

        this.storage.fetch(this.storage.apiPath, Server_ConvertToGenericContainer);
    }
}