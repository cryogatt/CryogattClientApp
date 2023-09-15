import { transient, inject, bindable, bindingMode } from 'aurelia-framework';

var $ = require('jquery');
import 'bootstrap-daterangepicker';
import * as moment from 'moment';
import * as toastr from 'toastr';

@transient()
@inject(Element)
export class DatePicker {

    public element: Element;

    // Date field bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) enabled: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value: string; // Should be an ISO string
    @bindable({ defaultBindingMode: bindingMode.twoWay }) model: Date;
    private datePicker;

    constructor(element) {
        this.element = element;
    }

    attached() {

        // Load the picker and set up events
        this.loadPicker();
    }

    loadPicker() {

        function changeCallback(start, end, element?: Element) {

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
        }, changeCallback).on('dp:change', e => {

            // Pass on the event to the aurelia binding system
            if (this && this.element) {

                var regEx = /(\d{2})\/(\d{2})\/(\d{4})/;
                var parts: string[] = ($(this.element).find(".date-picker").find(".date").val() as string).match(regEx);
                if (parts && parts.length > 3) {
                    this.model = new Date(parts[3] + "-" + parts[2] + "-" + parts[1]); // ISO format
                    this.value = this.model.toISOString();
                }
                else {
                    // Handle error
                    console.log("Date picker: dp:change callback - the date field value was either empty or invalid");
                    toastr.error("An error occurred while updating the date field.");
                }
            }
        });

        this.datePicker.on('mousedown.daterangepicker', e => {

            // Insert the current date if the field is currently empty
            if (!this.value || this.value === "") {
                $(this.element).find(".date-picker").find(".date").val(moment().format("DD/MM/YYYY"));;
            }
        });

        if (this.value) {
            changeCallback(moment(this.value), moment(this.value), this.element);
        }
    }

    detached() {
        $(this.element).daterangepicker('destroy');
    }

    valueChanged(newValue, oldValue) {

        if (!oldValue && this.datePicker) {

            // Get rid of the old picker
            $(this.element).daterangepicker('destroy');
            this.datePicker = null;

            // Load the picker again that the date is defined
            this.loadPicker();
        }
    }

    enabledChanged() {

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
    }
}


