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
var aurelia_dialog_1 = require("aurelia-dialog");
var server_1 = require("../../api/server");
var $ = require('jquery');
// Export modal dialogue view model
var ExportModal = /** @class */ (function () {
    // Constructor
    function ExportModal(dialogController) {
        this.controller = dialogController;
    }
    // Cause the actual export of data 
    ExportModal.prototype.export = function () {
        var _this = this;
        // Extract the parts of the date range
        var regEx = /(\d{2}\/\d{2}\/\d{4})[\s]?-[\s]?(\d{2}\/\d{2}\/\d{4})/;
        var parts = this.dateRange.match(regEx);
        if (parts && parts.length > 2) {
            var startDate = parts[1].trim();
            var endDate = parts[2].trim();
            // Post the data using the Web API
            server_1.Http_Export(startDate, endDate)
                .then(function (exportedData) { return URL.createObjectURL(exportedData); }) // TODO JMJ it would be nice if the save file dialogue displayed something other than "from: blob"
                .then(function (url) {
                var a = $("<a style='display: none;'/>");
                a.attr("href", url);
                a.attr("download", "Cryogatt-Sample-Records-Export.csv");
                $("body").append(a);
                a[0].click();
                window.URL.revokeObjectURL(url);
                a.remove();
                // Notify the controller to close the window
                _this.controller.ok();
            }).catch(function (error) {
                // Handle error (TODO JMJ this is only on the outer scope?)
                _this.controller.cancel(error);
            });
        }
        else {
            // Handle error
            this.controller.cancel("The export date range should be of the form DD/MM/YYYY - DD/MM/YYYY.");
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], ExportModal.prototype, "dateRange", void 0);
    ExportModal = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], ExportModal);
    return ExportModal;
}());
exports.ExportModal = ExportModal;
//# sourceMappingURL=export-modal.js.map