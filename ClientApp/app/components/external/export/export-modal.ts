import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Http_Export } from '../../api/server';

var $ = require('jquery');

// Export modal dialogue view model
@transient()
@autoinject()
export class ExportModal {

    // Range options
    @bindable({ defaultBindingMode: bindingMode.twoWay }) dateRange: string;

    // Modal binding
    public controller: DialogController;

    // Constructor
    constructor(dialogController: DialogController) {
        this.controller = dialogController;

    }

    // Cause the actual export of data 
    export() {

        // Extract the parts of the date range
        var regEx = /(\d{2}\/\d{2}\/\d{4})[\s]?-[\s]?(\d{2}\/\d{2}\/\d{4})/;
        var parts: string[] = this.dateRange.match(regEx);
        if (parts && parts.length > 2) {

            var startDate = parts[1].trim();
            var endDate = parts[2].trim();

            // Post the data using the Web API
            Http_Export(startDate, endDate)
                .then(exportedData => URL.createObjectURL(exportedData)) // TODO JMJ it would be nice if the save file dialogue displayed something other than "from: blob"
                .then(url => {
                    var a = $("<a style='display: none;'/>");
                    a.attr("href", url);
                    a.attr("download", "Cryogatt-Sample-Records-Export.csv");
                    $("body").append(a);
                    a[0].click();
                    window.URL.revokeObjectURL(url);
                    a.remove();

                    // Notify the controller to close the window
                    this.controller.ok();

                }).catch(error => {

                    // Handle error (TODO JMJ this is only on the outer scope?)
                    this.controller.cancel(error);
                });
        }
        else {
            // Handle error
            this.controller.cancel("The export date range should be of the form DD/MM/YYYY - DD/MM/YYYY.");
        }
    }
}