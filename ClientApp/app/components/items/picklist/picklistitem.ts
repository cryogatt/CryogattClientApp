import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of Contents
@transient()
export class PickListItem {
    @bindable uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) batchName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) position: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) primary_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) parent_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) gParent_description: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) ggParent_description: string;

    // Input validation for the form
    validate(): Promise<any> {

        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    }
}