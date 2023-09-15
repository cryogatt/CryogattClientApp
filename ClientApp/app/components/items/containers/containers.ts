import { transient, autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { GenericStorageItem } from '../generic-storage-item';
import { Container } from './container';
import { Server_ConvertToSingleGenericContainer, Server_ConvertFromGenericContainer } from '../../api/json-map';
import { StorageType } from '../storage-type';

@transient()
@autoinject()
export class Containers {

    // Contained type
    public containsTypeSingular: string;
    public containsTypePlural: string;

    // Commands enable / disable
    public canAddContents: boolean;
    public canViewContents: boolean;
    public canViewAliquots: boolean;

    private static auditMode: boolean = false;

    // Dialogue service
    private dialogService: DialogService;

    // Router for onwards navigation
    private router: Router;

    // Constructor
    constructor(dialogService: DialogService, router: Router) {

        this.dialogService = dialogService;
        this.router = router;// Might be able to get rid of this?
    }

    public static getAuditMode(): boolean {

        return Containers.auditMode;
    }

    public static setAuditMode(status:boolean) {

        Containers.auditMode = status;
    }

    // Generate a new item
    getNew(): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.CONTAINER;
        storedItem.containedType = this.containsTypeSingular;
        storedItem.convertTo = Server_ConvertToSingleGenericContainer;
        storedItem.convertFrom = Server_ConvertFromGenericContainer;
        storedItem.item = new Container();
        storedItem.item.uid = null;
        storedItem.item.addedDate = new Date();
        storedItem.item.type = "";
        storedItem.item.containsType = "";

        return storedItem;
    }

    // Generate a new item based on the current selection
    getSelected(item): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.CONTAINER;
        storedItem.convertTo = Server_ConvertToSingleGenericContainer;
        storedItem.convertFrom = Server_ConvertFromGenericContainer;

        // Copy existing properties plus - we want to keep the validate() method; hence this longer approach for now
        storedItem.item = new Container();
        storedItem.item.uid = item.uid;
        storedItem.item.name = item.name;
        storedItem.item.type = item.type;
        storedItem.item.addedDate = item.addedDate;
        storedItem.item.containsQty = item.containsQty;
        storedItem.item.containsType = item.containsType;

        return storedItem;
    }
}