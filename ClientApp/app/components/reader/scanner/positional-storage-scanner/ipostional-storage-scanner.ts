

export interface IPositionalStorageScanner {
      
    // The item containing positions for others items - box for example.
    storageItem: any;
    // The contents of the storage item - vials, etc.
    storageItemContents: any[];
    // The parent of the storage item - i.e rack, dewar etc
    storageItemParent: any;
    // Condition for accessing storage items contents/positions.
    storageItemFound: boolean;
}