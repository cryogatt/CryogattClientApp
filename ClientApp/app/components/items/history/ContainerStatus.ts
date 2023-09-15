import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of a material
@transient()
export class ContainerStatus {

    // Container bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) id: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) containerUid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) status: string;
        
}