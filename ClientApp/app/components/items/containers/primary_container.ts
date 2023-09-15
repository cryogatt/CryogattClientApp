import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of a primary container
@transient()
export class PrimaryContainer {

    // Container bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) position: number; 
    @bindable({ defaultBindingMode: bindingMode.twoWay }) status: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) labelled: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) batchName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) inceptDate: Date;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField1: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField2: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField3: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField4: string;
}