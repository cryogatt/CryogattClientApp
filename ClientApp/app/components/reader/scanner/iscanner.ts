
export interface IScanner {

    // General operations
    init(): void;
    scan(): any;
    // Unique list of tag uids (per antenna)
    previousScan: any[];
    // Variable to maintain if a change has occurred since prevoius scan
    change: boolean;
    // Clear data and reset variables to default settings
    clear();
}