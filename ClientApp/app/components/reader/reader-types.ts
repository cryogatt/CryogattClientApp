
export enum ReaderType {

    // IBTech MicroRWD based Single Reader (ICODE & ISO 15693 capable) packaged as P/N SR012
    CRYOGATT_SR012 = 1,

    // IBTech MicroRWD based Assignment Reader 10x1 (ICODE & ISO 15693 capable) packaged as P/N AR101
    CRYOGATT_AR101,

    // IBTech MicroRWD based Vial Box Reader 10x10 (ICODE & ISO 15693 capable) packaged as P/N R10101
    CRYOGATT_R10101,

    // Tagsys Medio P232 Reader (STEX2 & ISO 15693 capable) packaged as P/N NR002
    CRYOGATT_NR002,

    // COLD 10x10 Reader
    CRYOGATT_R10102
}