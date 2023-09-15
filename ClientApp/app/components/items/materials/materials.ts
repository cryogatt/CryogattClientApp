import { transient } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework';
import { GenericStorageItem } from '../generic-storage-item';
import { Material } from './material';
import { Server_ConvertFromMaterialExtended, Server_ConvertToSingleMaterial } from '../../api/json-map';
import { StorageType } from '../storage-type';
import Jsonmap = require("../../api/json-map");
import Server_ConvertToPrimaryContainer = Jsonmap.Server_ConvertToPrimaryContainer;
import { MaterialBatch } from "./material";

@transient()
@autoinject()
export class Materials {

    // Command properties
    public canViewAliquots: boolean;

    // Generate a new item based
    getNew(): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.MATERIAL;
        storedItem.convertTo = Server_ConvertToSingleMaterial;
        storedItem.convertFrom = Server_ConvertFromMaterialExtended;
        storedItem.item = new MaterialBatch();

        return storedItem;
    }

    // Generate a new item based on the current selection
    getSelected(item): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.MATERIAL;
        storedItem.convertTo = Server_ConvertToSingleMaterial;
        storedItem.convertFrom = Server_ConvertFromMaterialExtended;
        storedItem.item = Object.assign({}, item);

        return storedItem;
    }
}
