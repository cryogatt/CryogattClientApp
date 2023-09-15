import Scanner = require("./iscanner");
import Genericreader = require("../generic-reader");
import GenericReader = Genericreader.GenericReader;
import Readertypes = require("../reader-types");
import ReaderType = Readertypes.ReaderType;
import IScanner = Scanner.IScanner;
import { Inventory } from "../data-structures/inventory";
import * as toastr from 'toastr';

export class PositionalScanner implements IScanner {
    public reader: GenericReader;
    public lock: boolean = false;

    constructor(readerId: ReaderType) {

        this.reader = new GenericReader(readerId);
    }

    // Initialise the readerconvertFrom
    public async init() {

      await this.reader.init();
      this.previousScan = [];
    }
    // Responsible for gathering tags from service (reader) and manages the detection of new tags
    public async scan() {

        if (!this.lock) {

            this.lock = true;






            var newChange: boolean = false;


            let readerResponse: Inventory[] = await this.reader.getInventory().catch(error => {

                throw error;
            });

            const ResultArrayObjOne = readerResponse.filter(({ antenna: newreading }) => !this.previousScan.some(({ antenna: previousreading }) => previousreading === newreading));

            const ResultArrayObjTwo = this.previousScan.filter(({ antenna: previousreading }) => !readerResponse.some(({ antenna: newreading }) => previousreading === newreading));


            if (ResultArrayObjOne.length > 0 || ResultArrayObjTwo.length > 0) {

                this.changedSlots = [];
                // First read?
                if (this.previousScan.length !== 0 && this.keepPreviousScan) {

                    // Reset new found tags list



                    for (let antennaNo: number = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {

                        let thisRead = readerResponse.find(inv => inv.antenna === (antennaNo + 1));
                        let lastRead = this.previousScan.find(inv => inv.antenna === (antennaNo + 1));

                        var containsTag: boolean = false;

                        // Is there a tag at this antenna?
                        if (thisRead && thisRead.hasOwnProperty("UID")) {

                            if (readerResponse.find(inv => inv.antenna === (antennaNo + 1)).UID.length !== 0) {

                                containsTag = true;
                            }
                        }
                        // Was there a tag at this antenna on the last read?
                        if (lastRead && lastRead.hasOwnProperty("UID") && lastRead.UID.length !== 0) {

                            // Is there a tag now?
                            if (containsTag) {

                                // Is it not the same tag?
                                if (!readerResponse.find(inv => inv.antenna === (antennaNo + 1)).UID.find(newTag => newTag === (this.previousScan.find(inv => inv.antenna === (antennaNo + 1)).UID.find(lastTag => lastTag === newTag)))) {

                                    newChange = true;
                                    this.changedSlots.push(readerResponse.find(inv => inv.antenna === (antennaNo + 1)));
                                }
                            } // There is no tag on that antenna now
                            else {

                                newChange = true;
                                // Enter missing tag
                                let inv: Inventory = new Inventory();
                                inv.antenna = antennaNo + 1;
                                this.changedSlots.push((inv));
                            }
                        } // There was no tag on that antenna before
                        else {

                            // Change has occurred if new tag has appeared
                            if (containsTag) {

                                newChange = true;
                                this.changedSlots.push(readerResponse.find(inv => inv.antenna === (antennaNo + 1)));
                            }
                        }
                    }
                } else {

                    if (ResultArrayObjOne.length > 0) {


                        this.changedSlots = ResultArrayObjOne
                    }

                    if (ResultArrayObjTwo.length > 0) {

                        this.changedSlots = ResultArrayObjTwo
                    }

                    newChange = true;

                    //this.changedSlots = readerResponse;
                }

                if (newChange) {

                    // Replace previous list with new list from reader
                    this.previousScan = readerResponse;

                    this.change = true;
                }

            }

            this.lock = false;
        }

    }

    // Responsible for gathering tags from service (reader) and manages the detection of new tags for 10x1 reader
    public async scanTenByOne() {

        if (!this.lock) {

            this.lock = true;






            var newChange: boolean = false;


            let readerResponse: Inventory[] = await this.reader.getInventory().catch(error => {

                throw error;
            });

            const ResultArrayObjOne = readerResponse.filter(({ antenna: newreading }) => !this.previousScan.some(({ antenna: previousreading }) => previousreading === newreading));

            const ResultArrayObjTwo = this.previousScan.filter(({ antenna: previousreading }) => !readerResponse.some(({ antenna: newreading }) => previousreading === newreading));


            if (ResultArrayObjOne.length > 0 || ResultArrayObjTwo.length > 0) {

                this.changedSlots = [];
                // First read?
                if (this.previousScan.length !== 0 && this.keepPreviousScan) {

                    // Reset new found tags list
                   


                    for (let antennaNo: number = 0; antennaNo < this.reader.antennaQuantity; antennaNo++) {

                        let thisRead = readerResponse.find(inv => inv.antenna === (antennaNo + 1));
                        let lastRead = this.previousScan.find(inv => inv.antenna === (antennaNo + 1));

                        var containsTag: boolean = false;

                        // Is there a tag at this antenna?
                        if (thisRead && thisRead.hasOwnProperty("UID")) {

                            if (readerResponse.find(inv => inv.antenna === (antennaNo + 1)).UID.length !== 0) {

                                containsTag = true;
                            }
                        }
                        // Was there a tag at this antenna on the last read?
                        if (lastRead && lastRead.hasOwnProperty("UID") && lastRead.UID.length !== 0) {

                            // Is there a tag now?
                            if (containsTag) {

                                // Is it not the same tag?
                                if (!readerResponse.find(inv => inv.antenna === (antennaNo + 1)).UID.find(newTag => newTag === (this.previousScan.find(inv => inv.antenna === (antennaNo + 1)).UID.find(lastTag => lastTag === newTag)))) {

                                    newChange = true;
                                    this.changedSlots.push(readerResponse.find(inv => inv.antenna === (antennaNo + 1)));
                                }
                            } // There is no tag on that antenna now
                            else {

                                newChange = true;
                                // Enter missing tag
                                let inv: Inventory = new Inventory();
                                inv.antenna = antennaNo + 1;
                                this.changedSlots.push((inv));
                            }
                        } // There was no tag on that antenna before
                        else {

                            // Change has occurred if new tag has appeared
                            if (containsTag) {

                                newChange = true;
                                this.changedSlots.push(readerResponse.find(inv => inv.antenna === (antennaNo + 1)));
                            }
                        }
                    }
                } else {

                    if (ResultArrayObjOne.length > 0) {


                        this.changedSlots = ResultArrayObjOne
                    }

                    if (ResultArrayObjTwo.length > 0) {

                        this.changedSlots = ResultArrayObjTwo
                    }

                    newChange = true;

                    //this.changedSlots = readerResponse;
                }

                if (newChange) {

                    // Replace previous list with new list from reader
                    this.previousScan = readerResponse;

                    this.change = true;
                }
    
            }

            this.lock = false;
        }
    
    }

    public setChange(value: boolean) {

        this.change = value;
    }

    public clear() {

      this.change = false;
     // this.changedSlots = [];
      this.previousScan = [];
    }

    public changedSlots: Inventory[] = [];
    public previousScan: Inventory[] = [];
    public change: boolean = false;
    // Used to optimse sort/database calls by keeping a copy of the previous scan and only providing the new entries
    public keepPreviousScan: boolean = false;
}