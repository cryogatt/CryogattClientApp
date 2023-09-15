import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of a material
@transient()
export class HistoryType {

    // Container bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) userName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) event: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) location: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) date: string;
}