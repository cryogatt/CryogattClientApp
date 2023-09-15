import { transient, autoinject } from 'aurelia-framework';
import { StorageType } from './storage-type';
import { StorageModalMode } from './storage-modal-mode';

// Generic features of a storage item (whether container or material)
@transient()
@autoinject()
export class GenericStorageItem {

    // API (less the "api/v1" part, e.g. "dewars")
    public apiPath: string = "";

    // Title binding
    public title: string = "";

    // Dialogue mode, e.g. create, view, edit
    public mode: StorageModalMode;

    // Overall type, e.g. material, container, etc.
    public storageType: StorageType;

    // Item type - used to form text expressions
    public type_singular: string;

    // Commands enable / disable
    public canSave: boolean;
    public canEdit: boolean;

    // Possible contents, either a container or material or user
    public item;
    public containedType: string;

    // Conversion functions
    public convertTo;
    public convertFrom;

    public cropList:any[];
}