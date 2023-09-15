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
var aurelia_router_1 = require("aurelia-router");
var aurelia_dialog_1 = require("aurelia-dialog");
var auth_service_1 = require("../auth/auth-service");
var reader_service_1 = require("../auth/reader-service");
var import_modal_1 = require("../external/import/import-modal");
var export_modal_1 = require("../external/export/export-modal");
var generic_storage_1 = require("../items/generic-storage");
var resources_1 = require("../resources");
var $ = require('jquery');
var toastr = require("toastr");
var storage_positional_generic_assignment_1 = require("../items/storage-reader-operations/assignment/storage-positional-generic-assignment");
var storage_ten_by_one_assignment_1 = require("../items/storage-reader-operations/assignment/storage-ten-by-one-assignment");
var App = /** @class */ (function () {
    // Constructor
    function App(dialogService, authService, readerService, storage) {
        this.dialogService = dialogService;
        this.authService = authService;
        this.readerService = readerService;
        // Read the software version
        this.softwareVersion = resources_1.Resources.cryogattWebVersion;
        this.storage = storage;
    }
    // Configure the main router
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Cryogatt Sample Inventory';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([{
                route: 'login',
                name: 'login',
                settings: { icon: 'th-list' },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../login/login'),
                nav: false,
                title: 'Login',
            }, {
                route: 'Containers/:item?',
                name: 'containers',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/containers/container-list'),
                nav: false,
                title: 'Containers',
            }, {
                route: 'Samples/:item',
                name: 'Samples',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/containers/primary_containers'),
                nav: false,
                title: 'Samples',
            }, {
                route: 'history/:item',
                name: 'history',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/history/history'),
                nav: false,
                title: 'View History',
            }, {
                route: ['', 'materials'],
                name: 'materials',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/materials/material-list'),
                nav: true,
                title: 'Materials'
            }, {
                route: 'aliquots/:item',
                name: 'aliquots',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/materials/batch/aliquots'),
                nav: false,
                title: 'Aliquots',
            }, {
                route: 'cryobank/:item',
                name: 'cryobank',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/materials/batch/cryobank'),
                nav: false,
                title: 'Cryobank',
            }, {
                route: 'tested/:item',
                name: 'tested',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/materials/batch/tested'),
                nav: false,
                title: 'tested',
            }, {
                route: 'safety-duplication/:item',
                name: 'safety-duplication',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/materials/batch/safety-duplication'),
                nav: false,
                title: 'Safety Duplication',
            }, {
                route: 'picklist',
                name: 'picklist',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/picklist/picklist'),
                nav: true,
                title: 'Pick List',
            }, {
                route: 'listOfOrders',
                name: 'listOfOrders',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/distribution/order-list'),
                nav: true,
                title: 'List of Orders',
            }, {
                route: 'ViewContents/:item',
                name: 'ViewContents',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/distribution/contents/view-contents'),
                nav: false,
                title: 'View Contents',
            }, {
                route: 'addContents/:item',
                name: 'addContents',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/distribution/contents/add-contents'),
                nav: false,
                title: 'Add Contents',
            }, {
                route: 'users',
                name: 'users',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/users/users'),
                nav: true,
                title: 'Users',
            }, {
                route: 'disposal',
                name: 'disposal',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/Disposal/disposal-list'),
                nav: true,
                title: 'Disposed Items',
            }, {
                route: 'boxSlotBookingOperations',
                name: 'boxSlotBookingOperations',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-box-slots-booking-operations'),
                nav: true,
                title: 'Box Reader',
            }, {
                route: 'boxSlotsScanAgainestList',
                name: 'boxSlotsScanAgainestList',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/storage-reader-operations/scan-againest-list/storage-box-slots-scan-againest-list'),
                nav: false,
                title: 'Pick Items',
            }, {
                route: 'coldBoxSlotBookingOperations',
                name: 'coldBoxSlotBookingOperations',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-cold-box-slots-booking-operations'),
                nav: false,
                title: 'Pick Items',
            }, {
                route: 'coldBoxSlotsScanAgainestList',
                name: 'coldBoxSlotsScanAgainestList',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/storage-reader-operations/scan-againest-list/storage-cold-box-slots-scan-againest-list'),
                nav: false,
                title: 'Pick Items',
            }, {
                route: 'bulkBookingOperations',
                name: 'Bulk Booking Operations',
                settings: { icon: 'th-list', auth: true },
                moduleId: aurelia_framework_1.PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-bulk-booking-operations'),
                nav: true,
                title: 'Bulk Bulking Operations',
            }]);
        this.router = router;
    };
    App.prototype.assignmentTenByOne = function (previousResult) {
        // Navigate to the list of materials page to stop any other reader process simultanously occuring
        //this.router.navigate("materials-ten-by-one");
        var _this = this;
        this.router.navigate("materials");
        // Launch a modal dialogue - TODO Change here
        this.dialogService.open({ viewModel: storage_ten_by_one_assignment_1.StorageTenByOneAssignment /*StorageBulkGenericAssignment*/, model: previousResult, lock: false }).whenClosed(function (result) {
            if (!result.wasCancelled) {
                // Restart the operation unless cancelled
                _this.assignmentTenByOne(result.output);
            }
            else {
                if (result.output) {
                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
            if (reader_service_1.ReaderService.readerOn()) {
                reader_service_1.ReaderService.stopPollingReader();
            }
        }).catch(function (result) {
            // Handle error
            console.log("Assignment - dialog service error (catch)" + result);
            toastr.error("An error occurred during the assignment process.");
        });
    };
    App.prototype.assignment = function (previousResult) {
        var _this = this;
        // Navigate to the list of materials page to stop any other reader process simultanously occuring
        this.router.navigate("materials");
        // Launch a modal dialogue - TODO Change here
        this.dialogService.open({ viewModel: storage_positional_generic_assignment_1.StoragePositionalGenericAssignment /*StorageBulkGenericAssignment*/, model: previousResult, lock: false }).whenClosed(function (result) {
            if (!result.wasCancelled) {
                // Restart the operation unless cancelled
                _this.assignment(result.output);
            }
            else {
                if (result.output) {
                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
            if (reader_service_1.ReaderService.readerOn()) {
                reader_service_1.ReaderService.stopPollingReader();
            }
        }).catch(function (result) {
            // Handle error
            console.log("Assignment - dialog service error (catch)" + result);
            toastr.error("An error occurred during the assignment process.");
        });
    };
    // Import an existing set of data records
    App.prototype.import = function () {
        // Launch a modal dialogue to request the import parameters
        this.dialogService.open({ viewModel: import_modal_1.ImportModal, model: null, lock: false }).whenClosed(function (result) {
            if (!result.wasCancelled) {
                // Notify that the import was successful
                toastr.success("The import was successful.");
            }
            else {
                if (result.output) {
                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
        }).catch(function (result) {
            // Handle error
            console.log("Import - dialog service error (catch)");
            toastr.error("An error occurred during the import process.");
        });
    };
    // Export a set of data records
    App.prototype.export = function () {
        // Launch a modal dialogue to request the export parameters
        this.dialogService.open({ viewModel: export_modal_1.ExportModal, model: this.storage.filterByCropData, lock: false }).whenClosed(function (result) {
            if (!result.wasCancelled) {
                // Notify that the export was successful
                toastr.success("The export was successful.");
            }
            else {
                if (result.output) {
                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
        }).catch(function (result) {
            // Handle error
            console.log("Export - dialog service error (catch)");
            toastr.error("An error occurred during the export process.");
        });
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], App.prototype, "softwareVersion", void 0);
    App = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [aurelia_dialog_1.DialogService, auth_service_1.AuthService, reader_service_1.ReaderService, generic_storage_1.GenericStorage])
    ], App);
    return App;
}());
exports.App = App;
var AuthorizeStep = /** @class */ (function () {
    // Constructor
    function AuthorizeStep(authService) {
        this.authService = authService;
    }
    AuthorizeStep.prototype.run = function (navigationInstruction, next) {
        if (navigationInstruction.getAllInstructions().some(function (i) { return i.config.settings.auth; })) {
            var isLoggedIn = this.authService.isAuthenticated();
            if (!isLoggedIn) {
                return next.cancel(new aurelia_router_1.Redirect('login'));
            }
        }
        return next();
    };
    AuthorizeStep = __decorate([
        aurelia_framework_1.autoinject(),
        __metadata("design:paramtypes", [auth_service_1.AuthService])
    ], AuthorizeStep);
    return AuthorizeStep;
}());
//# sourceMappingURL=app.js.map