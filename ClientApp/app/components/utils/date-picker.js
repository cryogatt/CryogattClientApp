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
var $ = require('jquery');
require("bootstrap-daterangepicker");
var moment = require("moment");
var toastr = require("toastr");
var DatePicker = /** @class */ (function () {
    function DatePicker(element) {
        this.element = element;
    }
    DatePicker.prototype.attached = function () {
        // Load the picker and set up events
        this.loadPicker();
    };
    DatePicker.prototype.loadPicker = function () {
        var _this = this;
        function changeCallback(start, end, element) {
            // Use the current context of the change event, i.e. the top-level date-picker DOM object
            var $datePicker;
            if (this && this.element) {
                $datePicker = $(this.element);
            }
            else if (element) {
                $datePicker = $(element);
            }
            // Update the value and trigger the event
            if ($datePicker) {
                $datePicker.find(".date-picker").find(".date").val(start.format("DD/MM/YYYY"));
                $datePicker.trigger('dp:change');
            }
            else {
                // Handle error
                console.log("Date picker: change callback - no element could be defined");
                toastr.error("An error occurred while updating the date field.");
            }
        }
        // Operate in single date mode
        this.datePicker = $(this.element).daterangepicker({
            "startDate": moment(this.value),
            "endDate": moment(this.value),
            singleDatePicker: true,
            "buttonClasses": "btn btn-primary",
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, changeCallback).on('dp:change', function (e) {
            // Pass on the event to the aurelia binding system
            if (_this && _this.element) {
                var regEx = /(\d{2})\/(\d{2})\/(\d{4})/;
                var parts = $(_this.element).find(".date-picker").find(".date").val().match(regEx);
                if (parts && parts.length > 3) {
                    _this.model = new Date(parts[3] + "-" + parts[2] + "-" + parts[1]); // ISO format
                    _this.value = _this.model.toISOString();
                }
                else {
                    // Handle error
                    console.log("Date picker: dp:change callback - the date field value was either empty or invalid");
                    toastr.error("An error occurred while updating the date field.");
                }
            }
        });
        this.datePicker.on('mousedown.daterangepicker', function (e) {
            // Insert the current date if the field is currently empty
            if (!_this.value || _this.value === "") {
                $(_this.element).find(".date-picker").find(".date").val(moment().format("DD/MM/YYYY"));
                ;
            }
        });
        if (this.value) {
            changeCallback(moment(this.value), moment(this.value), this.element);
        }
    };
    DatePicker.prototype.detached = function () {
        $(this.element).daterangepicker('destroy');
    };
    DatePicker.prototype.valueChanged = function (newValue, oldValue) {
        if (!oldValue && this.datePicker) {
            // Get rid of the old picker
            $(this.element).daterangepicker('destroy');
            this.datePicker = null;
            // Load the picker again that the date is defined
            this.loadPicker();
        }
    };
    DatePicker.prototype.enabledChanged = function () {
        if (this.element) {
            if (!this.enabled) {
                // Remove the calendar icon if the date-picker element should be disabled, as it is not possible to disable it
                $(this.element).find(".date-picker").removeClass("input-group");
                var $span = $(this.element).find(".date-picker").find(".input-group-addon");
                if ($span && $span.length > 0) {
                    $span.remove();
                }
            }
            else {
                // Restore / add the span with the calendar icon if the date-picker is enabled
                $(this.element).find(".date-picker").addClass("input-group");
                $(this.element).find(".date-picker").append('<span class="input-group-addon" data-target="#date-picker" data-toggle="date-picker"><span class="glyphicon glyphicon-calendar"></span></span>');
            }
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], DatePicker.prototype, "enabled", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], DatePicker.prototype, "value", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Date)
    ], DatePicker.prototype, "model", void 0);
    DatePicker = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Object])
    ], DatePicker);
    return DatePicker;
}());
exports.DatePicker = DatePicker;
//# sourceMappingURL=date-picker.js.map