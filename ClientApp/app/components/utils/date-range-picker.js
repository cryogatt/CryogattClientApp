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
var DateRangePicker = /** @class */ (function () {
    function DateRangePicker(element) {
        this.element = element;
    }
    DateRangePicker.prototype.attached = function () {
        var _this = this;
        var startDate = moment();
        var endDate = moment();
        function changeCallback(start, end) {
            $(".date-range").val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
            $(".date-range-picker").trigger('drp:change');
        }
        $(this.element).daterangepicker({
            "ranges": {
                "All": [moment('01/01/1900', 'DD/MM/YYYY'), moment().endOf('month')],
                "Today": [moment(), moment()],
                "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                "Last 7 Days": [moment().subtract(6, 'days'), moment()],
                "Last 30 Days": [moment().subtract(29, 'days'), moment()],
                "This Month": [moment().startOf('month'), moment().endOf('month')],
                "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            "showCustomRangeLabel": true,
            "startDate": startDate,
            "endDate": endDate,
            "buttonClasses": "btn btn-primary",
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, changeCallback);
        $(".date-range-picker").on('drp:change', function (e) {
            _this.dateRange = $(".date-range").val();
        });
        changeCallback(startDate, endDate);
    };
    DateRangePicker.prototype.detached = function () {
        $(this.element).daterangepicker('destroy');
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], DateRangePicker.prototype, "dateRange", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Boolean)
    ], DateRangePicker.prototype, "enabled", void 0);
    DateRangePicker = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.inject(Element),
        __metadata("design:paramtypes", [Object])
    ], DateRangePicker);
    return DateRangePicker;
}());
exports.DateRangePicker = DateRangePicker;
//# sourceMappingURL=date-range-picker.js.map