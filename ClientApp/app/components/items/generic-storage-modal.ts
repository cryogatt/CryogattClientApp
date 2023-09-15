import { transient, autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Http_AddItem, Http_EditItem } from '../api/server';
import { GenericStorageItem } from './generic-storage-item';
import { StorageModalMode } from './storage-modal-mode';
import { observable } from 'aurelia-framework';
import * as toastr from 'toastr';

// Generic stored item modal dialogue view model
@transient()
@autoinject()
export class GenericStorageModal {

    // Model
    public model: GenericStorageItem;

    // Modal binding
    public controller: DialogController;

    // Constructor
    constructor(dialogController: DialogController) {

        this.controller = dialogController;
    }

    activate(model: GenericStorageItem) {

        this.model = model;
       
        // Command bindings
        switch (this.model.mode) {
            case StorageModalMode.CREATE:
                this.model.title = "Create New " + this.model.type_singular;
                this.model.canSave = true;
                //this.cropList = model.cropList;
                break;

            case StorageModalMode.EDIT:

                this.model.title = "Edit " + this.model.type_singular;
                this.model.canSave = true;
                break;

            case StorageModalMode.VIEW:

                this.model.title = "View " + this.model.type_singular;
                this.model.canEdit = true;
                break;

            default: { break; }
        };
    }
    //cropListChanged(newValue, oldValue) {
    //    // this will fire whenever the 'color' property changes
    //    this.cropList = newValue;
    //}
    // Save the changes / addition 
    save() {
        
        // Validate the changes
        this.model.item.validate(this.model.mode)
          .then((): void => {

                // Determine the object
                var item = this.model.convertFrom(this.model.item);

                // Determine the API based on the mode:
                if (this.model.mode === StorageModalMode.CREATE) {

                    // Post the data using the Web API
                    Http_AddItem(this.model.apiPath, item)
                        .then(data => {

                            // Transform the newly created item into the internal format
                            var record = this.model.convertTo(data);

                            // Notify the controller to close the window
                            this.controller.ok(record);

                        }).catch(error => {

                            // An error has occurred, e.g. no data, or invalid field values
                            toastr.error(error);
                        });

                }
                else if (this.model.mode === StorageModalMode.EDIT) {

                    // Post the data using the Web API
                    Http_EditItem(this.model.apiPath, this.model.item.uid, item)
                        .then((): void => {

                            // Switch back to view mode
                            this.setViewMode();

                            // Notify the user
                            toastr.success("The record was successfully updated.");
                        }).catch(error => {

                            // An error has occurred during the edit operation
                            toastr.error(error);
                            toastr.error("An error occurred while editing the container.");
                        });
                }                
            })
            .catch(error => {

                // Notify the user
                toastr.error(error);
            });
    }

    edit() {

        // Swap to Edit mode
        this.setEditMode();
    }

    cancel() {

        if (this.model.mode === StorageModalMode.CREATE) {
            this.controller.cancel();
        }
        else if (this.model.mode === StorageModalMode.EDIT) {
            this.controller.cancel();
        }
        else {
            // View mode - they might have edited, hence return the current item
           // this.controller.ok(this.model.item);
            this.controller.cancel();//TODO Revist the  
        }
    }
        
    // Configure the settings for Edit mode
    setEditMode() {

        // Set edit mode
        this.model.mode = StorageModalMode.EDIT;
        this.model.title = "Edit a " + this.model.type_singular;
        this.model.canEdit = false;
        this.model.canSave = true;
    }

    // Configure the settings for View mode
    setViewMode() {

        // Set view mode
        this.model.mode = StorageModalMode.VIEW;
        this.model.title = "View a " + this.model.type_singular;
        this.model.canEdit = true;
        this.model.canSave = false;
    }
}