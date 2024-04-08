"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var json_map_1 = require("../../../api/json-map");
var generic_storage_1 = require("../../generic-storage");
var Contents_1 = require("./Contents");
var AddContents = /** @class */ (function () {
    // Constructor
    function AddContents(storage, contents) {
        this.storage = storage;
        this.contents = contents;
    }
    // Sets up the specific bindings for contents
    AddContents.prototype.activate = function (routeParams) {
        // General properties
        this.storage.storageType = 'contents';
        this.storage.type_singular = "Content";
        this.storage.type_plural = "Contents";
        this.storage.title = "Add Contents";
        this.storage.subtitle = " "; //TODO get the consignment number
        // Set up the table schema
        this.storage.schema = new Map();
        this.storage.schema.set("UID", "UID");
        this.storage.schema.set("PrimaryDescription", "Labelled");
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
        this.storage.parseAndFetch(routeParams, "?status=SITE", json_map_1.Server_ConvertToContents);
    };
    AddContents = __decorate([
        aurelia_framework_1.useView('../../generic-storage.html'),
        aurelia_framework_1.inject(generic_storage_1.GenericStorage, Contents_1.Contents),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, Contents_1.Contents])
    ], AddContents);
    return AddContents;
}());
exports.AddContents = AddContents;
//# sourceMappingURL=add-contents.js.map