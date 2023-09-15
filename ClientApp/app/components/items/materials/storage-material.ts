import { transient, autoinject, bindable, bindingMode, observable } from 'aurelia-framework';
import { Http_GetMaterial } from '../../api/server';
import { Server_ConvertToMaterialExtended } from '../../api/json-map';
import { Material } from './material';
import { StorageModalMode } from '../storage-modal-mode';
import * as toastr from 'toastr';
import { MaterialBatch } from './material';

// Generic features of a storage material
@transient()
@autoinject()
export class StorageMaterial {

    // Material bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) material: MaterialBatch;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) mode: StorageModalMode;

    public cropList: string[];
   // public crops: string[];
    @observable query: any;

    bind() {
        if (this.mode !== StorageModalMode.CREATE) {

            // Fetch the material using the Web API 
            Http_GetMaterial(this.material.uid)
                .then(data => {

                    var item = Server_ConvertToMaterialExtended(data);
                    if (item) {

                        // Store the result locally
                        this.material = item;

                    }
                    else {

                        // Undefined item error
                        toastr.error("An error occurred, and the record could only be part-retrieved.");
                    }
                }).catch(error => {

                    // An error has occurred, e.g. no data
                    toastr.error(error);
                });
        }
        else {
            this.cropList = this.material.cropList;
            
        }
    }
}