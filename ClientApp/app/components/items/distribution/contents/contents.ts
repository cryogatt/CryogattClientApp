import { transient, bindable, bindingMode } from 'aurelia-framework';

// Generic features of Contents
@transient()
export class Contents {

    public canAddContents: boolean;
    public canAddToShipment: boolean;
    public canUseReader: boolean;
    public static canDispatchShipment: boolean;
    public static canReceiveShipment: boolean;
    public commandBtnTxt: string;

    @bindable({ defaultBindingMode: bindingMode.twoWay }) uid: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) BatchName: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) Sample_Type: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) Materials: Map<string,string>;
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