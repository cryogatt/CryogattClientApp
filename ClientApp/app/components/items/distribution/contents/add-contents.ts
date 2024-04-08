import { useView, inject } from 'aurelia-framework';
import { Server_ConvertToContents } from '../../../api/json-map';
import { GenericStorage } from '../../generic-storage'
import { Contents } from './Contents'

@useView('../../generic-storage.html')
@inject(GenericStorage, Contents)
export class AddContents {

    // Base list view model
    public storage: GenericStorage;
    public contents: Contents;

    // Constructor
    constructor(storage: GenericStorage, contents: Contents) {
        this.storage = storage;
        this.contents = contents;
    }

    // Sets up the specific bindings for contents
    activate(routeParams) {

        // General properties
        this.storage.storageType = 'contents';
        this.storage.type_singular = "Content";
        this.storage.type_plural = "Contents";
        this.storage.title = "Add Contents";
        this.storage.subtitle = " ";//TODO get the consignment number

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("PrimaryDescription","Labelled");
        this.storage.schema.set("Batch", "Batch");
        this.storage.schema.set("Stored In", "Stored In");
        this.storage.schema.set("gParent_description", "Stack");
        this.storage.schema.set("ggParent_description", "Dewar");

        // Command presence
        this.storage.canCreateItem = false;
        this.storage.canEditItem = false;
        this.storage.canViewItem = false;
        this.storage.canUpdatePickList = false;
        this.storage.canAddBatchToPickList = false;
        this.storage.canDeleteItem = false;

        this.storage.canViewHistory = true;
        this.contents.canAddContents = true;
        this.contents.canAddToShipment = true;
        
        // Fetch the data using the Web API
        this.storage.parseAndFetch(routeParams, "?status=SITE", Server_ConvertToContents);
    }    
}


