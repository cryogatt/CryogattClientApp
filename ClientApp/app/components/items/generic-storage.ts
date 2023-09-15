import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Http_AddItemsToPickList, Http_DeleteItems, Http_DeleteItemsFromPickList, Http_GetItems, Http_AddItemsToShipment } from '../api/server';
import { Server_ConvertToPicklist, Server_GetCrops } from '../api/json-map';
import { GenericStorageModal } from './generic-storage-modal';
import { GenericStorageItem } from './generic-storage-item';
import { StorageModalMode } from './storage-modal-mode';
import * as toastr from 'toastr';

var $ = require('jquery');
import 'bootstrap';


// Generic features of a set of items in storage (whether container or material)
@transient()
@autoinject()
export class GenericStorage {
    
    // API (less the "api/v1" part, e.g. "dewars")
    public apiPath: string = "";

    // Modal dialog service
    public dialogService: DialogService;

    // Title binding
    public title: string = "Generic Storage";
    public subtitle: string;
    public subsubtitle: string = "";
    // Overall storage type, e.g. container, material
    public storageType: string;

    // Item type - used to form text expressions
    public type_singular: string;
    public type_plural: string;

    // Binding for the table data
    @bindable({ defaultBindingMode: bindingMode.twoWay }) items: any[];
    public schema: Map<string, string>;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedItem: any;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) selectAll: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) pageSize;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) currentPage;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) totalItems;
    @bindable tableApi;
    /*@bindable filterByCropData: any[];*/
    @bindable({ defaultBindingMode: bindingMode.twoWay }) selectedCrop: string;
    // Commands enable / disable
    public canAddBatchToPickList: boolean;
    public canAddToPickList: boolean;
    public canCreateItem: boolean;
    public canDeleteFromPickList: boolean;
    public canDeleteItem: boolean;
    public canEditItem: boolean;
    public canUpdatePickList: boolean;
    public canViewItem: boolean;
    public canViewHistory: boolean;
    public selectMultiple: boolean;

    public createItemInfo: string;

    // Reader Specific cmds
    public canUseReader: boolean;
    public canUpdateDb: boolean;
    public canStoreItems: boolean;
    public canWithdrawItems: boolean;
    public canAuditItems: boolean;
    public commandBtnTxt: string;
    public canUseResetBtn: boolean;
    public canDisposeItems: boolean;

    public filterByCropData: any[];
    private rawData: any[];

    //filter by crop data configurableField_1 = 'alex1'


    // Specific option for picklist selection where two exist
    @bindable({ defaultBindingMode: bindingMode.twoWay }) isBatchPickListSelection: boolean;

    // Filters for the table data
    dataFilters = [
        { value: "", custom: this.searchTextFilter }
    ];



    // Constructor
    constructor(dialogService: DialogService) {

        this.dialogService = dialogService;
        this.selectAll = false;
        this.currentPage = 1;
        this.pageSize = 10;
        this.isBatchPickListSelection = false;
    }

    // Add the selected items to the shipment
    addToShipment() {
        // Prepare the list of selected items
        var items: string[] = [];
        for (var item of this.items) {
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }

        // Post the data using the Web API
        if (items.length > 0) {
            Http_AddItemsToShipment(items, this.apiPath) //apiPath also includes params for previous page but is ignored by server for this request.
                .then(data => {

                    // Inform the user of the success
                    toastr.success("The Order was successfully updated.");

                }).catch(error => {

                    // Inform the user of the error
                    toastr.error(error);
                });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    }


    // Add the selected items to the Pick List
    addToPickList() {

        // Prepare the list of selected items
        var items: string[] = [];
        for (var item of this.items) {
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }

        // Post the data using the Web API
        if (items.length > 0) {
            Http_AddItemsToPickList(items, false, this.isBatchPickListSelection)
                .then(data => {

                    // Inform the user of the success
                    toastr.success("The Pick List was successfully updated.");

                }).catch(error => {

                    // Inform the user of the error
                    toastr.warning(error);
                });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    }

    // Add the entire batch to the Pick List
    addBatchToPickList() {

        // Prepare the list of selected items
        var items: string[] = [];
        for (var item of this.items) {
            if (item.$isPicked) {
                // Add the item to the list
                items.push(item.uid);
            }
        }

        // Post the data using the Web API
        if (items.length > 0) {
            Http_AddItemsToPickList(items, true, false)
                .then(result => {

                    // Inform the user of the success
                    toastr.success("The Pick List was successfully updated.");

                }).catch(error => {

                    // Inform the user of the error
                    toastr.warning(error);
                });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    }

    // Create a new storage item (launch modal dialogue)
    async create(item: GenericStorageItem) {

        // Further initialisation of the model
        item.mode = StorageModalMode.CREATE;
        item.type_singular = this.type_singular;
        item.apiPath = this.apiPath;

/*        item.cropList = this.filterByCropData;*/
        // Launch the modal dialogue
        this.dialogService.open({ viewModel: GenericStorageModal, model: item, lock: false }).whenClosed(result => {
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
                    for (var entry of this.items) {
                        if (entry.$isSelected) {
                            entry.$isSelected = false;
                        }
                    }

                    // Add the new selected item to the table
                    result.output.$isSelected = true;
                    this.items.push(result.output);

                    this.selectedItem = this.items[this.items.length - 1];

                    // Notify that the element was successfully created
                    toastr.success("The new " + item.type_singular.toLowerCase() + " was successfully created.");

                    setTimeout(this.navigateToSelected.bind(this), 100);
                }
                else {
                    // Undefined result error
                    toastr.error("An error occurred, and the new record was not created.");
                    console.log("Create new record - undefined record returned");
                }
            }
        });
    }

    // Delete the selected items
    delete(convertTo, param?) {

        // Prepare the list of selected ids
        var ids: string[] = [];
        for (var item of this.items) {
            if (item.$isPicked) {
                // Add the item to the list
                ids.push(item.uid);
            }
        }

        if (ids.length > 0) {
            Http_DeleteItems(this.apiPath, ids)
                .then(result => {

                    // Inform the user of the success
                    toastr.success("The " + this.type_plural + " list was successfully updated.");

                    var path = this.apiPath;
                    if (param) {

                      path += param;
                    } 
                    // Refresh the list using the Web API 
                    Http_GetItems(path)
                        .then(data => {

                            var items = convertTo(data);
                            if (items) {

                                // Store the result locally
                                this.items = items;
                            }
                            else {
                                // Undefined items list
                                toastr.error("An error occurred, and no records can be displayed.");
                                this.items = [];
                            }
                        }).catch(error => {

                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        });

                }).catch(error => {

                    // An error has occurred
                    toastr.error(error);
                    toastr.error("An error occurred while deleting items from the list.");
                });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    }

    // Delete the selected items from the Pick List
    deleteFromPickList() {

        // Prepare the list of selected ids
        var ids: string[] = [];
        for (var item of this.items) {
            if (item.$isPicked) {
                // Add the item to the list
                ids.push(item.uid);
            }
        }

        if (ids.length > 0) {
            Http_DeleteItemsFromPickList(ids)
                .then(result => {

                    // Inform the user of the success
                    toastr.success("The Pick List was successfully updated.");

                    // Refresh the picklist using the Web API 
                    Http_GetItems(this.apiPath)
                        .then(data => {

                            var items = Server_ConvertToPicklist(data);
                            if (items) {

                                // Store the result locally
                                this.items = items;
                            }
                            else {
                                // Undefined items list
                                toastr.error("An error occurred, and no records can be displayed.");
                                this.items = [];
                            }
                        }).catch(error => {

                            // An error has occurred, e.g. no data
                            toastr.error(error);
                        });

                }).catch(error => {

                    // An error has occurred
                    toastr.error(error);
                    toastr.error("An error occurred while deleting items from the picklist.");
                });
        }
        else {
            // No items selected
            toastr.warning("No items have been selected (use the checkboxes on the list).");
        }
    }

    // Edit a storage item (launch modal dialogue)
    edit(item: GenericStorageItem) {

        // Further initialisation of the model
        item.mode = StorageModalMode.EDIT;
        item.type_singular = this.type_singular;
        item.apiPath = this.apiPath;

        // Launch the modal dialogue
        this.dialogService.open({ viewModel: GenericStorageModal, model: item, lock: false }).whenClosed(result => {
            if (!result.wasCancelled) {
                if (result.output) {

                    // Find the selectedItem in the items list
                    var index = this.items.findIndex(item => { return this.selectedItem.uid === item.uid });
                    if (index >= 0) {

                        // This causes the binding to update and the highlight on the item
                        result.output.$isSelected = true;
                        this.items.splice(index, 1, result.output);

                        // Re-select the item
                        this.selectedItem = this.items[index];
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
    }

    // Fetch data from the specified API path
    async fetch(apiPath: string, convertTo) {

        // Fetch the data using the Web API 
        await Http_GetItems(apiPath)
            .then(data => {

                var items = convertTo(data);

                if (items) {

                    // Store the result locally
                    this.rawData = items;
                    this.items = items.reverse();

                    //filter unique crops
                    if (apiPath == "materials") {
                        var unique = Server_GetCrops(items);

                        this.filterByCropData = unique;
                    }
                }
                else {

                    // Undefined items list
                    toastr.error("An error occurred, and no records can be displayed.");
                    this.items = [];
                }
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
                this.items = [];
            });
    }


    // Determine the API path, then use it to fetch data
    parseAndFetch(routeParams, subPath: string, convertTo) {

        // Split string into its parts: path/id/subtitle
        if (routeParams && routeParams.item) {
            var paramParts: string[] = routeParams.item.split('%0B');
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
    }

    rowSelected($event) {
        // Set the selected UID
        this.selectedItem = $event.detail.row;
    }

    // Search the current dataset for the search term
    searchTextFilter(filterValue: string, row): boolean {

        var found: boolean = false;

        // Search the current dataset and filter based on the search text
        if (filterValue == "") {
            // No value to filter
            return true;
        }
        else {
            // Check all of the key values in the row for the search text
            Object.keys(row).forEach(key => {
                if ((!key.startsWith('$') && !key.toLowerCase().includes('UID')) && row[key]) {
                    if (row[key].toString().toLowerCase().includes(filterValue.toLowerCase())) {
                        found = true;
                    }
                }
            });
        }

        return found;
    }

    selectAllForPickList() {

        // Set the $isPicked on all rows
        for (var item of this.items) {
            item.$isPicked = this.selectAll;
        }
    }

    // View a storage item (launch modal dialogue)
    view(item: GenericStorageItem) {

        // Further initialisation of the model
        item.mode = StorageModalMode.VIEW;
        item.type_singular = this.type_singular;
        item.apiPath = this.apiPath;

        // Launch the modal dialogue
        this.dialogService.open({ viewModel: GenericStorageModal, model: item, lock: false }).whenClosed(result => {
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
                    var index = this.items.findIndex(item => { return this.selectedItem.uid === item.uid });
                    if (index >= 0) {

                        // This causes the binding to update and the highlight on the item
                        result.output.$isSelected = true;
                        this.items.splice(index, 1, result.output);

                        // Re-select the item
                        this.selectedItem = this.items[index];
                    }
                    else {
                        // Error - could not find the element
                        toastr.error("The item could not be updated in the list.");
                    }
                }
            }
        });
    }

    // Navigates to the page of the first selected item in the list 
    //Due to a timming issue in au-table pagination revealItem when adding an item to table data a setTimeout function should be used with this function
    public navigateToSelected() {

      let selectedItem = this.items.find(item => item.$isSelected);

      if (selectedItem) {

        this.tableApi.revealItem(selectedItem);
      }
    }

    filterUsingSelectedCrop($event) {
        // Set the selected UID

        //this.rawData = items;
        if (this.selectedCrop == null) {
            this.items = this.rawData.reverse();
        }else {
            var items = this.rawData.filter(o => o.configurableField_1 == this.selectedCrop)
            this.items = items.reverse();
        }
    }

}
