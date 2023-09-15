import { transient, useView, autoinject } from 'aurelia-framework';
import { Server_ConvertToUsers, Server_ConvertToUser, Server_ConvertFromUser } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';
import { StorageType } from '../storage-type';
import { GenericStorageItem } from '../generic-storage-item';
import { User } from './user';

@transient()
@useView('../generic-storage.html')
@autoinject()
export class Users {

    // Base list view model
    public storage: GenericStorage;

    // Constructor
    constructor(storage: GenericStorage) {
        this.storage = storage;
    }

    // Sets up the specific bindings for Users
    bind() {

        // General storage properties
        this.storage.storageType = 'user';
        this.storage.type_singular = "User";
        this.storage.type_plural = "Users";
        this.storage.title = this.storage.type_plural;
        this.storage.apiPath = "users";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("userName", "User Name");
        this.storage.schema.set("firstName", "First Name");
        this.storage.schema.set("lastName", "Last Name");
        this.storage.schema.set("email", "Email");
      //  this.storage.schema.set("lastLoginDate", "Last Login");
        this.storage.schema.set("addedDate", "Added Date");
        this.storage.schema.set("updatedDate", "Updated Date");
        this.storage.schema.set("isAdministrator", "Administrator");

        // Command presence
        this.storage.canCreateItem = true;
        this.storage.canDeleteItem = true;
        this.storage.canEditItem = true;
        this.storage.canViewItem = true;
        // Fetch the data using the Web API
        this.storage.fetch(this.storage.apiPath, Server_ConvertToUsers);
    }

    // Create a new user (launch modal dialogue)
    create() {

        // Hand off to the generic object
        this.storage.create(this.getNew());
    }

    // Delete one or more users from the list
    delete() {

        // Hand off to the generic object
        this.storage.delete(Server_ConvertToUsers);
    }

    // Edit a user (launch modal dialogue)
    edit() {

        // Hand off to the generic object
        this.storage.edit(this.getSelected(this.storage.selectedItem));
    }

    // View a user (launch modal dialogue)
    view() {

        // Hand off to the generic object
        this.storage.view(this.getSelected(this.storage.selectedItem));
    }

    // Generate a new item
    getNew(): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.USER;
        storedItem.convertTo = Server_ConvertToUser;
        storedItem.convertFrom = Server_ConvertFromUser;
        storedItem.item = new User();
        storedItem.item.addedDate = new Date();

        return storedItem;
    }

    // Generate a new item based on the current selection
    getSelected(item): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.USER;
        storedItem.convertTo = Server_ConvertToUser;
        storedItem.convertFrom = Server_ConvertFromUser;
        storedItem.item = Object.assign({}, item);

        return storedItem;
    }

}
