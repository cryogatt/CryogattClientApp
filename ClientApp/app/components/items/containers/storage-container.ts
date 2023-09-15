import { transient, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { Http_GetContainerGeneralTypes, Http_GetContainerSpecificTypes } from '../../api/server';
import { Container } from './container';
import { StorageModalMode } from '../storage-modal-mode';
import * as toastr from 'toastr';
import { Server_ConvertToGeneralTypes, Server_ConvertToSubtypes } from '../../api/json-map';
import { GeneralType, Subtype } from './container-ident';

// Generic features of a storage container
@transient()
@autoinject()
export class StorageContainer {

    // Container bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) container: Container;
    @bindable mode: StorageModalMode;
    @bindable generalTypes: GeneralType[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) generalType: GeneralType;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) subtype: Subtype;
    @bindable subtypes: Subtype[];
    @bindable({ defaultBindingMode: bindingMode.twoWay }) canShowAddedDate: boolean;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) addedDate: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) canShowQty: boolean = false;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) canShowContainsType: boolean = false;
    @bindable containedTypes: Subtype[];

    bind() {

      if (this.mode !== StorageModalMode.VIEW)
      {
        // Retrieve the container types
        this.loadGeneralTypes(); 
      }

      this.container.containsQty = !this.container.containsQty ? 0 : this.container.containsQty;
    }

    // Retrieve the General types
    loadGeneralTypes() {

        // Fetch the (this container) types using the Web API 
        Http_GetContainerGeneralTypes(3) // TODO Add enum for levels - Hardcoded for root 
            .then(data => {

                if (data && data.hasOwnProperty('Types')) {

                  this.generalTypes = Server_ConvertToGeneralTypes(data);
                  this.generalType = this.generalTypes[0];
                  this.loadSubTypes();
                } 
            }).catch(error => {

                // An error has occurred, e.g. no data
                toastr.error(error);
            });
    }

    loadSubTypes() {

      if (this.mode === StorageModalMode.CREATE) {
        // Fetch the contained types using the Web API
        Http_GetContainerSpecificTypes(this.generalType.ident)
          .then(data => {

            if (data && data.hasOwnProperty('Subtypes')) {

              this.subtypes = Server_ConvertToSubtypes(data);
              this.container.type = this.subtypes[0].description;
              // Call the selected type for the default value
              this.subTypeSelected();
            }
          }).catch(error => {

            // An error has occurred, e.g. no data
            toastr.error(error);
          });
      }
    }

    subTypeSelected() {
      
      // Upon creating storage record offer change to add contained types
      this.loadContainedTypes();      
    }

    loadContainedTypes() {

      // TODO Replace with call to server - Hardcoded for now as dewar is the only item this applies to
      if (this.generalType.ident === 4) { // Dewar 

        this.canShowQty = true;
        this.canShowContainsType = true;

        // Fetch the contained types using the Web API
        Http_GetContainerSpecificTypes(3) // Rack
          .then(data => {

            if (data) {

              this.containedTypes = Server_ConvertToSubtypes(data);
            }
          }).catch(error => {

            // An error has occurred, e.g. no data
            toastr.error(error);
          });
      } else {

        this.canShowQty = false;
        this.canShowContainsType = false;
      }
    }
}