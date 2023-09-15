import { transient, bindable, bindingMode, autoinject } from 'aurelia-framework';

@transient()
@autoinject()
export class BarcodeSample {

    // Tag UID
    @bindable({ defaultBindingMode: bindingMode.twoWay }) uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) tagIdent: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) barcode: string;

    // Input validation for the form
    validate(): Promise<any> {

        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    }
}