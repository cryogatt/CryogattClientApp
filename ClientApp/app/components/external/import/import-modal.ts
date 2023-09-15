import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Http_Import } from '../../api/server';

var $ = require('jquery');
import * as toastr from 'toastr';


// Import modal dialogue view model
@transient()
@autoinject()
export class ImportModal {

    // Filename
    @bindable({ defaultBindingMode: bindingMode.twoWay }) fileNames: FileList;

    // Modal binding
    public controller: DialogController;

    // Constructor
    constructor(dialogController: DialogController) {
        this.controller = dialogController;
    }

    attached() {

        // Cause the file input button to load the file dialogue
        $('.select-import-file').on('click', function () {
            $('.import-file').trigger('click');
        });
    }

    // Cause the actual import of data 
    import() {

        if (this.fileNames && this.fileNames.length > 0 && this.fileNames[0] && this.fileNames[0].name && this.fileNames[0].name !== "") {

            // Add only one file (the first)
            var fileReader = new FileReader();
            fileReader.readAsText(this.fileNames[0]);
            fileReader.onload = () => {

                var formData: string = fileReader.result;
                if (formData) {

                    // Post the data using the Web API
                    Http_Import(formData)
                        .then(response => {

                          if (response) {

                            toastr.warning(response);
                          }
                            // Tell the controller to close the window
                            this.controller.ok();

                        }).catch(error => {

                            // Handle the error
                            this.controller.cancel(error);
                        });
                }
            }
        }
        else {

            // Error
            toastr.error("No .CSV file was selected for the import.");
        }
    }
}