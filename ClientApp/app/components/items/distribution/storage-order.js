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
var server_1 = require("../../api/server");
var json_map_1 = require("../../api/json-map");
var order_1 = require("./order");
var storage_modal_mode_1 = require("../storage-modal-mode");
var $ = require('jquery');
var toastr = require("toastr");
// Generic features of a storage material
var StorageOrder = /** @class */ (function () {
    function StorageOrder() {
    }
    StorageOrder.prototype.bind = function () {
        var _this = this;
        // Fetch the Contacts
        server_1.Http_GetContacts()
            .then(function (data) {
            // Store the result locally
            _this.contacts = data;
            if (_this.mode !== storage_modal_mode_1.StorageModalMode.CREATE) {
                // Fetch the order using the Web API 
                server_1.Http_GetOrder(_this.order.uid)
                    .then(function (data) {
                    var item = json_map_1.Server_ConvertToOrderExtended(data);
                    if (item) {
                        // Store the result locally
                        _this.order = item;
                        // Bind the dates
                        _this.ordered_date = (_this.order.ordered_date !== null) ? _this.order.ordered_date : undefined;
                        _this.dispatched_date = (_this.order.dispatched_date !== null) ? _this.order.dispatched_date : undefined;
                        _this.arrived_date = (_this.order.arrived_date !== null) ? _this.order.arrived_date : undefined;
                    }
                    else {
                        // Undefined item error
                        toastr.error("An error occurred, and the record could only be part-retrieved.");
                    }
                }).catch(function (error) {
                    // An error has occurred, e.g. no data
                    toastr.error(error);
                });
            }
        }).catch(function (error) {
            // An error has occurred, e.g. no data
            toastr.error(error);
            _this.contacts = [];
        });
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", order_1.Order)
    ], StorageOrder.prototype, "order", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], StorageOrder.prototype, "mode", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], StorageOrder.prototype, "contacts", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], StorageOrder.prototype, "ordered_date", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], StorageOrder.prototype, "dispatched_date", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], StorageOrder.prototype, "arrived_date", void 0);
    StorageOrder = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], StorageOrder);
    return StorageOrder;
}());
exports.StorageOrder = StorageOrder;
//# sourceMappingURL=storage-order.js.map