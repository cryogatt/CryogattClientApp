import { transient, bindable, bindingMode, autoinject, observable } from 'aurelia-framework';

// Generic features of a material record for table
@transient()
@autoinject()
export class Material {

    // Material bindings
    @bindable uid: string;

    // Basic form info
    @bindable({ defaultBindingMode: bindingMode.twoWay }) name: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField_1: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField_2: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField_3: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) configurableField_4: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) notes: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) cryoSeedQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) testedSeedQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) sDSeedQty: number;


    // Input validation for the form
    validate(): Promise<any> {

        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    }
}

// Generic features of a batch 
@transient()
@autoinject()
export class MaterialBatch {

  // Material bindings
  @bindable uid: string;

  // Basic form info
    @bindable({ defaultBindingMode: bindingMode.twoWay }) name: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) date: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) sampleQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) materialInfo: MaterialInfo[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) notes: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) cryoSeedQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) testedSeedQty: number;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) sDSeedQty: number;
    @bindable  cropList: string[];

  // Input validation for the form
  validate(): Promise<any> {

    // Check name has been entered and is a suitable length
    if (!this.name) {

      return Promise.reject('Batch ID required!');
    } else if (this.name.length > 50) {

      return Promise.reject('Batch ID must be no longer than 50 characters!');
    } else if (this.name.indexOf('$') !== -1) {

      return Promise.reject('Batch ID cannot contain character: $');
    }

    // Check info does not contain $ as this data is exported to excel 
    for (let info of this.materialInfo) {

      if (info.value && info.value.indexOf('$') !== -1) {

        return Promise.reject(info.field + ' cannot contain character: $');
      }
    }
    return Promise.resolve();
    }
}

// Generic features of a material record for table
@transient()
@autoinject()
export class MaterialInfo {

@bindable({ defaultBindingMode: bindingMode.twoWay }) field: string;
@bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;

}

