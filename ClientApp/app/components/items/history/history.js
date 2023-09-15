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
var json_map_1 = require("../../api/json-map");
var generic_storage_1 = require("../generic-storage");
var History = /** @class */ (function () {
    // Constructor
    function History(storage) {
        this.storage = storage;
    }
    // Sets up the specific bindings for history
    History.prototype.activate = function (routeParams) {
        // General storage properties
        this.storage.apiPath = "History";
        this.storage.type_singular = "History";
        this.storage.type_plural = "History";
        this.storage.title = "View History";
        // Set up the table schema
        this.storage.schema = new Map();
        this.storage.schema.set("userName", "User");
        this.storage.schema.set("event", "Event");
        this.storage.schema.set("location", "Location");
        this.storage.schema.set("date", "Date");
        // Recover the API path and fetch the data
        this.storage.fetch(this.storage.apiPath + "/" + routeParams.item, json_map_1.Server_ConvertToHistory);
    };
    History = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.useView('../generic-storage.html'),
        aurelia_framework_1.inject(generic_storage_1.GenericStorage),
        __metadata("design:paramtypes", [Object])
    ], History);
    return History;
}());
exports.History = History;
//# sourceMappingURL=history.js.map