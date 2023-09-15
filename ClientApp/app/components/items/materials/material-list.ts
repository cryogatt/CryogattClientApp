import { transient, useView, inject } from 'aurelia-framework';
import { Server_ConvertToMaterial } from '../../api/json-map';
import { GenericStorage } from '../generic-storage'
import { Materials } from './materials'
import { Http_GetItems } from '../../api/server';
import Jsonmap = require("../../api/json-map");
import Material = require("./material");
import MaterialInfo = Material.MaterialInfo;

@transient()
@useView('../generic-storage.html')
@inject(GenericStorage, Materials)
export class MaterialList {

    // Base list view model
    public storage: GenericStorage;
    public materials: Materials;

    public materialInfos: MaterialInfo[];

    //public filterByCropData: any[];

    // Constructor
    constructor(storage: GenericStorage, materials: Materials) {
        this.storage = storage;
        this.materials = materials;
    }

    // Sets up the specific bindings for Materials
    async bind() {
        // General properties
        this.storage.storageType = 'material';
        this.storage.type_singular = "Batch";
        this.storage.type_plural = "Materials";
        this.storage.title = "Sample Records";
        this.storage.apiPath = "materials";

        // Command presence
        this.storage.canCreateItem = true; // TODO Change here
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        this.storage.canUpdatePickList = false;
        this.storage.canAddBatchToPickList = false;
        this.materials.canViewAliquots = true;

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        // Configurable fields
        this.storage.schema.set("name", "Batch ID"); // TODO Change here - find way to make configurable

        // Get Material header fields for table
        this.materialInfos = Jsonmap.Server_ConvertToMaterialInfo(await Http_GetItems("MaterialInfo"));
        if (this.materialInfos) {

            this.storage.schema.set("configurableField_1", this.materialInfos[0].field);
            this.storage.schema.set("configurableField_2", this.materialInfos[1].field);
            this.storage.schema.set("configurableField_3", this.materialInfos[2].field);
            this.storage.schema.set("configurableField_4", this.materialInfos[3].field);
        }
        // Fetch the data using the Web API
        await this.storage.fetch(this.storage.apiPath, Server_ConvertToMaterial);
       
    }

    // Create a new material (launch modal dialogue)
    create() {

        let item = this.materials.getNew();
        // Deep copy of the list of headers so the value are not updated to this empty copy
        item.item.materialInfo = JSON.parse(JSON.stringify(this.materialInfos));
        item.item.cropList = this.storage.filterByCropData;

        // Hand off to the generic object
        this.storage.create(item);
    }

    // Edit (launch modal dialogue)
    edit() {

        // Hand off to the generic object
        this.storage.edit(this.materials.getSelected(this.storage.selectedItem));
    }

    // View a material (launch modal dialogue)
    view() {

        // Hand off to the generic object
        this.storage.view(this.materials.getSelected(this.storage.selectedItem));
    }

}
