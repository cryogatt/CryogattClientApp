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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_dialog_1 = require("aurelia-dialog");
var server_1 = require("../api/server");
var json_map_1 = require("../api/json-map");
var generic_storage_modal_1 = require("./generic-storage-modal");
var storage_modal_mode_1 = require("./storage-modal-mode");
var toastr = require("toastr");
var $ = require('jquery');
require("bootstrap");
// Generic features of a set of items in storage (whether container or material)
var GenericStorage = /** @class */ (function () {
    // Constructor
    function GenericStorage(dialogService) {
        // API (less the "api/v1" part, e.g. "dewars")
        this.apiPath = "";
        // Title binding
        this.title = "Generic Storage";
        this.subsubtitle = "";
        // Filters for the table data
        this.dataFilters = [
            { value: "", custom: this.searchTextFilter }
        ];
        this.dialogService = dialogService;
        this.selectAll = false;
        this.currentPage = 1;
        this.pageSize = 10;
        this.isBatchPickListSelection = false;
    }
    // Add the selected items to the shipment
    GenericStorage.prototype.addToShipment = function () {
        // Prepare the list of selected items
        var items = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }
        // Post the data using the Web API
        if (items.length > 0) {
            server_1.Http_AddItemsToShipment(items, this.apiPath) //apiPath also includes params for previous page but is ignored by server for this request.
                .then(function (data) {
                // Inform the user of the success
                toastr.success("The Order was successfully updated.");
            }).catch(function (error) {
                // Inform the user of the error
                toastr.error(error);
            });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    };
    // Add the selected items to the Pick List
    GenericStorage.prototype.addToPickList = function () {
        // Prepare the list of selected items
        var items = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }
        // Post the data using the Web API
        if (items.length > 0) {
            server_1.Http_AddItemsToPickList(items, false, this.isBatchPickListSelection)
                .then(function (data) {
                // Inform the user of the success
                toastr.success("The Pick List was successfully updated.");
            }).catch(function (error) {
                // Inform the user of the error
                toastr.warning(error);
            });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    };
    // Add the entire batch to the Pick List
    GenericStorage.prototype.addBatchToPickList = function () {
        // Prepare the list of selected items
        var items = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }
        // Post the data using the Web API
        if (items.length > 0) {
            server_1.Http_AddItemsToPickList(items, true, false)
                .then(function (result) {
                // Inform the user of the success
                toastr.success("The Pick List was successfully updated.");
            }).catch(function (error) {
                // Inform the user of the error
                toastr.warning(error);
            });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    };
    // Create a new storage item (launch modal dialogue)
    GenericStorage.prototype.create = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Further initialisation of the model
                item.mode = storage_modal_mode_1.StorageModalMode.CREATE;
                item.type_singular = this.type_singular;
                item.apiPath = this.apiPath;
                /*        item.cropList = this.filterByCropData;*/
                // Launch the modal dialogue
                this.dialogService.open({ viewModel: generic_storage_modal_1.GenericStorageModal, model: item, lock: false }).whenClosed(function (result) {
                    if (result.wasCancelled) {
                        if (result.output) {
                            // Report the error
                            console.log(result.output);
                            toastr.error(result.output);
                        }
                    }
                    else {
                        // Add the new item, and select it
                        if (result.output) {
                            // Clear any currently selected items
                            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                                var entry = _a[_i];
                                if (entry.$isSelected) {
                                    entry.$isSelected = false;
                                }
                            }
                            // Add the new selected item to the table
                            result.output.$isSelected = true;
                            _this.items.push(result.output);
                            _this.selectedItem = _this.items[_this.items.length - 1];
                            // Notify that the element was successfully created
                            toastr.success("The new " + item.type_singular.toLowerCase() + " was successfully created.");
                            setTimeout(_this.navigateToSelected.bind(_this), 100);
                        }
                        else {
                            // Undefined result error
                            toastr.error("An error occurred, and the new record was not created.");
                            console.log("Create new record - undefined record returned");
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // Delete the selected items
    GenericStorage.prototype.delete = function (convertTo, param) {
        var _this = this;
        // Prepare the list of selected ids
        var ids = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$isPicked) {
                // Add the item to the list
                ids.push(item.uid);
            }
        }
        if (ids.length > 0) {
            server_1.Http_DeleteItems(this.apiPath, ids)
                .then(function (result) {
                // Inform the user of the success
                toastr.success("The " + _this.type_plural + " list was successfully updated.");
                var path = _this.apiPath;
                if (param) {
                    path += param;
                }
                // Refresh the list using the Web API 
                server_1.Http_GetItems(path)
                    .then(function (data) {
                    var items = convertTo(data);
                    if (items) {
                        // Store the result locally
                        _this.items = items;
                    }
                    else {
                        // Undefined items list
                        toastr.error("An error occurred, and no records can be displayed.");
                        _this.items = [];
                    }
                }).catch(function (error) {
                    // An error has occurred, e.g. no data
                    toastr.error(error);
                });
            }).catch(function (error) {
                // An error has occurred
                toastr.error(error);
                toastr.error("An error occurred while deleting items from the list.");
            });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    };
    // Delete the selected items from the Pick List
    GenericStorage.prototype.deleteFromPickList = function () {
        var _this = this;
        // Prepare the list of selected ids
        var ids = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$isPicked) {
                // Add the item to the list
                ids.push(item.uid);
            }
        }
        if (ids.length > 0) {
            server_1.Http_DeleteItemsFromPickList(ids)
                .then(function (result) {
                // Inform the user of the success
                toastr.success("The Pick List was successfully updated.");
                // Refresh the picklist using the Web API 
                server_1.Http_GetItems(_this.apiPath)
                    .then(function (data) {
                    var items = json_map_1.Server_ConvertToPicklist(data);
                    if (items) {
                        // Store the result locally
                        _this.items = items;
                    }
                    else {
                        // Undefined items list
                        toastr.error("An error occurred, and no records can be displayed.");
                        _this.items = [];
                    }
                }).catch(function (error) {
                    // An error has occurred, e.g. no data
                    toastr.error(error);
                });
            }).catch(function (error) {
                // An error has occurred
                toastr.error(error);
                toastr.error("An error occurred while deleting items from the picklist.");
            });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    };
    // Edit a storage item (launch modal dialogue)
    GenericStorage.prototype.edit = function (item) {
        var _this = this;
        // Further initialisation of the model
        item.mode = storage_modal_mode_1.StorageModalMode.EDIT;
        item.type_singular = this.type_singular;
        item.apiPath = this.apiPath;
        // Launch the modal dialogue
        this.dialogService.open({ viewModel: generic_storage_modal_1.GenericStorageModal, model: item, lock: false }).whenClosed(function (result) {
            if (!result.wasCancelled) {
                if (result.output) {
                    // Find the selectedItem in the items list
                    var index = _this.items.findIndex(function (item) { return _this.selectedItem.uid === item.uid; });
                    if (index >= 0) {
                        // This causes the binding to update and the highlight on the item
                        result.output.$isSelected = true;
                        _this.items.splice(index, 1, result.output);
                        // Re-select the item
                        _this.selectedItem = _this.items[index];
                    }
                    else {
                        // Error - could not find the element
                        toastr.error("The item could not be updated in the list.");
                    }
                }
            }
            else {
                if (result.output) {
                    // Handle error
                    console.log(result.output);
                    toastr.error(result.output);
                }
            }
        });
    };
    // Fetch data from the specified API path
    GenericStorage.prototype.fetch = function (apiPath, convertTo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Fetch the data using the Web API 
                    return [4 /*yield*/, server_1.Http_GetItems(apiPath)
                            .then(function (data) {
                            var items = convertTo(data);
                            if (items) {
                                // Store the result locally
                                _this.rawData = items;
                                _this.items = items.reverse();
                                //filter unique crops
                                if (apiPath == "materials") {
                                    var unique = json_map_1.Server_GetCrops(items);
                                    _this.filterByCropData = unique;
                                }
                            }
                            else {
                                // Undefined items list
                                toastr.error("An error occurred, and no records can be displayed.");
                                _this.items = [];
                            }
                        }).catch(function (error) {
                            // An error has occurred, e.g. no data
                            toastr.error(error);
                            _this.items = [];
                        })];
                    case 1:
                        // Fetch the data using the Web API 
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Determine the API path, then use it to fetch data
    GenericStorage.prototype.parseAndFetch = function (routeParams, subPath, convertTo) {
        // Split string into its parts: path/id/subtitle
        if (routeParams && routeParams.item) {
            var paramParts = routeParams.item.split('%0B');
            if (paramParts.length >= 3) {
                this.subtitle = paramParts[2];
                this.apiPath = decodeURIComponent(paramParts[0]) + "/" + paramParts[1] + "/" + subPath;
                // Fetch the data using the Web API
                this.fetch(this.apiPath, convertTo);
            }
            else {
                // Not enough parameters in the route error
                toastr.error("A navigation error occurred.");
                console.log("Parse and fetch - insufficient route parameters: " + paramParts.length);
            }
        }
        else {
            // Undefined parameters error
            toastr.error("A navigation error occurred.");
            console.log("Parse and fetch - undefined routeParams");
        }
    };
    GenericStorage.prototype.rowSelected = function ($event) {
        // Set the selected UID
        this.selectedItem = $event.detail.row;
    };
    // Search the current dataset for the search term
    GenericStorage.prototype.searchTextFilter = function (filterValue, row) {
        var found = false;
        // Search the current dataset and filter based on the search text
        if (filterValue == "") {
            // No value to filter
            return true;
        }
        else {
            // Check all of the key values in the row for the search text
            Object.keys(row).forEach(function (key) {
                if ((!key.startsWith('$') && !key.toLowerCase().includes('UID')) && row[key]) {
                    if (row[key].toString().toLowerCase().includes(filterValue.toLowerCase())) {
                        found = true;
                    }
                }
            });
        }
        return found;
    };
    GenericStorage.prototype.selectAllForPickList = function () {
        // Set the $isPicked on all rows
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            item.$isPicked = this.selectAll;
        }
    };
    // View a storage item (launch modal dialogue)
    GenericStorage.prototype.view = function (item) {
        var _this = this;
        // Further initialisation of the model
        item.mode = storage_modal_mode_1.StorageModalMode.VIEW;
        item.type_singular = this.type_singular;
        item.apiPath = this.apiPath;
        // Launch the modal dialogue
        this.dialogService.open({ viewModel: generic_storage_modal_1.GenericStorageModal, model: item, lock: false }).whenClosed(function (result) {
            if (result.wasCancelled) {
                if (result.output) {
                    // Handle error
                    console.log(result.output);
                    toastr.error(result.output);
                }
            }
            else {
                if (result.output) {
                    // Find the selectedItem in the items list
                    var index = _this.items.findIndex(function (item) { return _this.selectedItem.uid === item.uid; });
                    if (index >= 0) {
                        // This causes the binding to update and the highlight on the item
                        result.output.$isSelected = true;
                        _this.items.splice(index, 1, result.output);
                        // Re-select the item
                        _this.selectedItem = _this.items[index];
                    }
                    else {
                        // Error - could not find the element
                        toastr.error("The item could not be updated in the list.");
                    }
                }
            }
        });
    };
    // Navigates to the page of the first selected item in the list 
    //Due to a timming issue in au-table pagination revealItem when adding an item to table data a setTimeout function should be used with this function
    GenericStorage.prototype.navigateToSelected = function () {
        var selectedItem = this.items.find(function (item) { return item.$isSelected; });
        if (selectedItem) {
            this.tableApi.revealItem(selectedItem);
        }
    };
    GenericStorage.prototype.filterUsingSelectedCrop = function ($event) {
        // Set the selected UID
        var _this = this;
        //this.rawData = items;
        if (this.selectedCrop == null) {
            this.items = this.rawData.reverse();
        }
        else {
            var items = this.rawData.filter(function (o) { return o.configurableField_1 == _this.selectedCrop; });
            this.items = items.reverse();
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], GenericStorage.prototype, "items", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericStorage.prototype, "selectedItem", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], GenericStorage.prototype, "selectAll", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericStorage.prototype, "pageSize", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericStorage.prototype, "currentPage", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], GenericStorage.prototype, "totalItems", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], GenericStorage.prototype, "tableApi", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], GenericStorage.prototype, "selectedCrop", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], GenericStorage.prototype, "isBatchPickListSelection", void 0);
    GenericStorage = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogService])
    ], GenericStorage);
    return GenericStorage;
}());
exports.GenericStorage = GenericStorage;
//# sourceMappingURL=generic-storage.js.map