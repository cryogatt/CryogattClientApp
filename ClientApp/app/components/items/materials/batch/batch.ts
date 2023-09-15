import { transient, bindable, bindingMode, autoinject } from 'aurelia-framework';

// Generic features of Contents
@transient()
export class Batch {
    @bindable uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) BatchName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) position: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) status: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) Sample_Type: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) primary_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) parent_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) gParent_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) ggParent_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) site: string;

    // Input validation for the form
    validate(): Promise<any> {

        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    }
}