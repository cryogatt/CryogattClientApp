import { IScanner } from "../scanner/iscanner";

export interface IStorageOperations extends IScanner {

    // Used for to init reader & set properties
    start();

    // Entry of new Containers where required items are an array of the types of containers required
    assignment(requiredItems: string[]): void;

    // Used for operations where items read need to be compared to list i.e Pick List
    // Optional parameters are: 
    //                         listItemsParents - the parents of the list items which may also be scanned
    //                         requiredItems - the storage items which must be read in order to determine where the items are being stored or withdrawn
    //                         newParentItems - additional types which must be read but are not in the table - i.e a dry shipper
    scanAgainestList(list: any[], listItemsParents?: any[], requiredItems?: string[], newParentItems?: any[]): void;

    // Booking of Samples in & out of storage 
    bookingInOut(requiredItems?: any[]): void;

    // Prompt for user
    status: string;

    // Operation has suceeded and user can update the database
    canUpdateDb: boolean;

    // List of items found
    foundItems: any[];

    // A single new sample where the key is the Uid & value is the tag ident - Note, all samples must be individually assigned.
    // Implemented as a Map as an alternative to a tuple
    newSample: Map<string, number>;
};