import { PLATFORM, autoinject, bindable } from 'aurelia-framework';
import { Router, RouterConfiguration, Redirect, NavigationInstruction, Next } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import { AuthService } from '../auth/auth-service';
import { ReaderService } from '../auth/reader-service'
import { ImportModal } from '../external/import/import-modal';
import { ExportModal } from '../external/export/export-modal';
import { GenericStorage } from '../items/generic-storage';
import Storagebarcodesampleassignment = require("../items/storage-reader-operations/assignment/storage-barcode-sample-assignment");
import StorageBarcodeSampleAssignment = Storagebarcodesampleassignment.StorageBarcodeSampleAssignment;

import { Resources } from '../resources';

var $ = require('jquery');
import * as toastr from 'toastr';
import { StorageBulkGenericAssignment } from '../items/storage-reader-operations/assignment/storage-bulk-generic-assignment';
import { StoragePositionalGenericAssignment } from '../items/storage-reader-operations/assignment/storage-positional-generic-assignment';
import { StorageTenByOneAssignment } from '../items/storage-reader-operations/assignment/storage-ten-by-one-assignment';
import { StorageBoxSlotsAssignment } from '../items/storage-reader-operations/assignment/storage-box-slots-assignment';

@autoinject()
export class App {

    // Modal dialog service
    public dialogService: DialogService;

    // Router for web page navigation
    private router: Router;

    // Authorisation service
    public authService: AuthService;

    // Connection to Reader Service
    public readerService: ReaderService;

    // Software version
    @bindable softwareVersion;

    public storage: GenericStorage;

    // Constructor
    constructor(dialogService: DialogService, authService: AuthService, readerService: ReaderService, storage: GenericStorage) {

        this.dialogService = dialogService;
        this.authService = authService;
        this.readerService = readerService;

        // Read the software version
        this.softwareVersion = Resources.cryogattWebVersion;
        this.storage = storage;
    }

    // Configure the main router
    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Cryogatt Sample Inventory';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([{
            route: 'login',
            name: 'login',
            settings: { icon: 'th-list' },
            moduleId: PLATFORM.moduleName('../login/login'),
            nav: false,
            title: 'Login',
        }, {
            route: 'Containers/:item?',
            name: 'containers',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/containers/container-list'),
            nav: false,
            title: 'Containers',
        }, {
            route: 'Samples/:item',
            name: 'Samples',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/containers/primary_containers'),
            nav: false,
            title: 'Samples',
        }, {
            route: 'history/:item',
            name: 'history',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/history/history'),
            nav: false,
            title: 'View History',
        }, {
            route: ['', 'materials'],
            name: 'materials',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/materials/material-list'),
            nav: true,
            title: 'Materials'

        }, {
            route: 'aliquots/:item',
            name: 'aliquots',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/materials/batch/aliquots'),
            nav: false,
            title: 'Aliquots',
        }, {
            route: 'cryobank/:item',
            name: 'cryobank',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/materials/batch/cryobank'),
            nav: false,
            title: 'Cryobank',
        }, {
            route: 'tested/:item',
            name: 'tested',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/materials/batch/tested'),
            nav: false,
            title: 'tested',
        }, {
            route: 'safety-duplication/:item',
            name: 'safety-duplication',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/materials/batch/safety-duplication'),
            nav: false,
            title: 'Safety Duplication',
        }, {
            route: 'picklist',
            name: 'picklist',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/picklist/picklist'),
            nav: true,
            title: 'Pick List',
        }, {
            route: 'listOfOrders',
            name: 'listOfOrders',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/distribution/order-list'),
            nav: true,
            title: 'List of Orders',
        }, {
            route: 'ViewContents/:item',
            name: 'ViewContents',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/distribution/contents/view-contents'),
            nav: false,
            title: 'View Contents',
        }, {
            route: 'addContents/:item',
            name: 'addContents',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/distribution/contents/add-contents'),
            nav: false,
            title: 'Add Contents',
        }, {
            route: 'users',
            name: 'users',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/users/users'),
            nav: true,
            title: 'Users',
        }, {
            route: 'disposal',
            name: 'disposal',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/Disposal/disposal-list'),
            nav: true,
            title: 'Disposed Items',
        }, {
            route: 'boxSlotBookingOperations',
            name: 'boxSlotBookingOperations',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-box-slots-booking-operations'),
            nav: true,
            title: 'Box Reader',
        }, {
            route: 'boxSlotsScanAgainestList',
            name: 'boxSlotsScanAgainestList',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/storage-reader-operations/scan-againest-list/storage-box-slots-scan-againest-list'),
            nav: false,
            title: 'Pick Items',
        }, {
            route: 'coldBoxSlotBookingOperations',
            name: 'coldBoxSlotBookingOperations',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-cold-box-slots-booking-operations'),
            nav: false,
            title: 'Pick Items',
        }, {
            route: 'coldBoxSlotsScanAgainestList',
            name: 'coldBoxSlotsScanAgainestList',
            settings: { icon: 'th-list', auth: true },
                moduleId: PLATFORM.moduleName('../items/storage-reader-operations/scan-againest-list/storage-cold-box-slots-scan-againest-list'),
            nav: false,
            title: 'Pick Items',
        },{
            route: 'bulkBookingOperations',
            name: 'Bulk Booking Operations',
            settings: { icon: 'th-list', auth: true },
            moduleId: PLATFORM.moduleName('../items/storage-reader-operations/booking-operations/storage-bulk-booking-operations'),
            nav: true,
            title: 'Bulk Bulking Operations',
        }]);

        this.router = router;
    }

    assignmentTenByOne(previousResult?) {

        // Navigate to the list of materials page to stop any other reader process simultanously occuring
        //this.router.navigate("materials-ten-by-one");

        this.router.navigate("materials");
        // Launch a modal dialogue - TODO Change here
        this.dialogService.open({ viewModel: StorageTenByOneAssignment /*StorageBulkGenericAssignment*/, model: previousResult, lock: false }).whenClosed(result => {
            if (!result.wasCancelled) {

                // Restart the operation unless cancelled
                this.assignmentTenByOne(result.output);
            }
            else {
                if (result.output) {

                    // Notify the user of the error (error is passed back as the output)
                    toastr.error(result.output);
                }
            }
            if (ReaderService.readerOn()) {

                ReaderService.stopPollingReader();
            }
        }).catch(result => {

            // Handle error
            console.log("Assignment - dialog service error (catch)" + result);
            toastr.error("An error occurred during the assignment process.")
        });
    }

    assignment(previousResult?) {

      // Navigate to the list of materials page to stop any other reader process simultanously occuring
      this.router.navigate("materials");

      // Launch a modal dialogue - TODO Change here
      this.dialogService.open({ viewModel: StoragePositionalGenericAssignment /*StorageBulkGenericAssignment*/, model: previousResult, lock: false }).whenClosed(result => {
        if (!result.wasCancelled) {

          // Restart the operation unless cancelled
          this.assignment(result.output);
        }
        else {
          if (result.output) {

            // Notify the user of the error (error is passed back as the output)
            toastr.error(result.output);
          }
        }
        if (ReaderService.readerOn()) {

          ReaderService.stopPollingReader();
        }
      }).catch(result => {

        // Handle error
        console.log("Assignment - dialog service error (catch)" + result);
        toastr.error("An error occurred during the assignment process.")
      });
    }

    // Import an existing set of data records
    import() {

        // Launch a modal dialogue to request the import parameters
        this.dialogService.open({ viewModel: ImportModal, model: null, lock: false }).whenClosed(result => {
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
        }).catch(result => {

            // Handle error
            console.log("Import - dialog service error (catch)");
            toastr.error("An error occurred during the import process.")
        });
    }

    // Export a set of data records
    export() {

        // Launch a modal dialogue to request the export parameters
        this.dialogService.open({ viewModel: ExportModal, model: this.storage.filterByCropData, lock: false }).whenClosed(result => {
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
        }).catch(result => {

            // Handle error
            console.log("Export - dialog service error (catch)");
            toastr.error("An error occurred during the export process.")
        });

    }
}

@autoinject()
class AuthorizeStep {

    // Authorisation service
    public authService: AuthService;

    // Constructor
    constructor(authService: AuthService) {

        this.authService = authService;
    }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
            var isLoggedIn = this.authService.isAuthenticated();
            if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}