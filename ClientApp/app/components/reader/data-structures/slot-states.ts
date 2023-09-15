export enum SlotStates {

  EMPTY,          // No container present
  OCCUPIED,       // Container present 
  MISSING,        // Container missing
  REMOVED,        // Container removed from slot and therefore changed state from STORED to UNSTORED
  RESERVED,       // Tag in slot is not the tag in the database
  NEW,            // New UNSTORED container
  MOVED,          // Container already stored in another position 
  PENDING,        // Pending planned withdrawal     
  ERROR,          // Generic error state - Mostly used for tag without correct ident 
  STORAGE_TAG,    // Contains tag for storage item - i.e slot 0 on a box is reserved for box tag, etc
  LOADING,        // Something has been detected by the reader and is being processed (call the server causing delay)
  UNASSIGNED      // Unrecognised container in slot
}