export enum BoxStates {

  NO_BOX_SIG,           // No box (or anything else) is detected
  KNOWN_BOX_SIG,        // A box which exists in the database is being detected
  UNKNOWN_BOX_SIG,      // A box which does not exists in the database is being detected
  BAD_TAG_SIG,          // A tag which is not of the desired type (a box) is being detected
  BOX_CHANGED_SIG        // Box on reader has been swapped before reader could change state to no box
};