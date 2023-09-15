import { transient } from 'aurelia-framework';
import { autoinject } from 'aurelia-framework';
import { GenericStorageItem } from '../generic-storage-item';
import { Order } from './order';
import { Server_ConvertToOrder, Server_ConvertFromOrder, Server_ConvertToSingleOrder, Server_ConvertFromOrderExtended } from '../../api/json-map';
import { StorageType } from '../storage-type';

@transient()
@autoinject()
export class Orders {

    // Command properties
    public canViewInbound: boolean;
    public canViewOutbound: boolean;

    public canViewContents: boolean;
    public canAddContentsButton: boolean;
     
    // Generate a new item based
    getNew(): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.ORDER;
        storedItem.convertTo = Server_ConvertToSingleOrder;
        storedItem.convertFrom = Server_ConvertFromOrderExtended;
        storedItem.item = new Order();

        return storedItem;
    }

    // Generate a new item based on the current selection
    getSelected(item): GenericStorageItem {

        var storedItem = new GenericStorageItem();
        storedItem.storageType = StorageType.ORDER;
        storedItem.convertTo = Server_ConvertToSingleOrder;
        storedItem.convertFrom = Server_ConvertFromOrderExtended;
        storedItem.item = Object.assign({}, item);

        return storedItem;
    }
}