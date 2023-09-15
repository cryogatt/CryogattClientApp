
import { transient, useView, inject } from 'aurelia-framework';
import { Server_ConvertToBatch } from '../../../api/json-map';
import { GenericStorage } from '../../generic-storage'
import { Materials } from '../materials'

@transient()
@useView('../../generic-storage.html')
@inject(GenericStorage, Materials)
export class SafetyDuplication {

    // Base list view model
    public storage: GenericStorage;
    public materials: Materials;

    // Constructor
    constructor(storage: GenericStorage, materials: Materials) {
        this.storage = storage;
        this.materials = materials;
    }

    // Sets up the specific bindings for Materials
    async activate(routeParams) {

        // General properties
        this.storage.storageType = 'material';
        this.storage.type_singular = " ";
        this.storage.type_plural = this.storage.type_singular;
        this.storage.title = "Safety Duplication";
        this.storage.subtitle = "";
        this.storage.apiPath = "aliquots";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("primary_description", "Description"); // TODO - Change here
        // ToDo Add primary description
//        this.storage.schema.set("Status", "Status");
        this.storage.schema.set("parent_description", "Stored In");
        this.storage.schema.set("gParent_description", ".");
        this.storage.schema.set("ggParent_description", "..");
        this.storage.schema.set("site", "...");

        // Command presence
        this.storage.canViewHistory = true;
        this.storage.canAddToPickList = true;
        this.storage.canUpdatePickList = true;

        // Fetch the data using the Web API
        this.storage.fetch(this.setPath(routeParams), Server_ConvertToBatch);
    }

    private setPath(routeParams: any): string {

        return this.storage.apiPath + "/" + routeParams.item + "?BATCH_TYPE=" + "Safety Duplication";
    }
}
