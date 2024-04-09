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
exports.ImportModal = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_dialog_1 = require("aurelia-dialog");
var server_1 = require("../../api/server");
var $ = require('jquery');
var toastr = require("toastr");
// Import modal dialogue view model
var ImportModal = /** @class */ (function () {
    // Constructor
    function ImportModal(dialogController) {
        this.controller = dialogController;
    }
    ImportModal.prototype.attached = function () {
        // Cause the file input button to load the file dialogue
        $('.select-import-file').on('click', function () {
            $('.import-file').trigger('click');
        });
    };
    // Cause the actual import of data 
    ImportModal.prototype.import = function () {
        var _this = this;
        if (this.fileNames && this.fileNames.length > 0 && this.fileNames[0] && this.fileNames[0].name && this.fileNames[0].name !== "") {
            // Add only one file (the first)
            var fileReader = new FileReader();
            fileReader.readAsText(this.fileNames[0]);
            fileReader.onload = function () {
                var formData = fileReader.result;
                if (formData) {
                    // Post the data using the Web API
                    (0, server_1.Http_Import)(formData)
                        .then(function (response) {
                        if (response) {
                            toastr.warning(response);
                        }
                        // Tell the controller to close the window
                        _this.controller.ok();
                    }).catch(function (error) {
                        // Handle the error
                        _this.controller.cancel(error);
                    });
                }
            };
        }
        else {
            // Error
            toastr.error("No .CSV file was selected for the import.");
        }
    };
    __decorate([
        (0, aurelia_framework_1.bindable)({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", FileList)
    ], ImportModal.prototype, "fileNames", void 0);
    ImportModal = __decorate([
        (0, aurelia_framework_1.transient)(),
        (0, aurelia_framework_1.autoinject)(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogController])
    ], ImportModal);
    return ImportModal;
}());
exports.ImportModal = ImportModal;
//# sourceMappingURL=import-modal.js.map