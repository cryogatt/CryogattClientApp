import { transient, useView, inject } from 'aurelia-framework';
import { Server_ConvertToHistory } from '../../api/json-map';
import { GenericStorage } from '../generic-storage';

@transient()
@useView('../generic-storage.html')
@inject(GenericStorage)
export class History {

    // Base list view model
    public storage: GenericStorage;

    // Constructor
    constructor(storage) {
        this.storage = storage;
    }

    // Sets up the specific bindings for history
    activate(routeParams) {
        // General storage properties
        this.storage.apiPath = "History";
        this.storage.type_singular = "History";
        this.storage.type_plural = "History";
        this.storage.title = "View History";

        // Set up the table schema
        this.storage.schema = new Map<string, string>();
        this.storage.schema.set("userName", "User");
        this.storage.schema.set("event", "Event");
        this.storage.schema.set("location", "Location");
        this.storage.schema.set("date", "Date");

        // Recover the API path and fetch the data
        this.storage.fetch(this.storage.apiPath + "/" + routeParams.item, Server_ConvertToHistory);
    }
}
