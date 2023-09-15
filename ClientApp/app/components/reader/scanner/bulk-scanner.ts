import Scanner = require("./iscanner");
import Genericreader = require("../generic-reader");
import GenericReader = Genericreader.GenericReader;
import Readertypes = require("../reader-types");
import ReaderType = Readertypes.ReaderType;
import { Inventory } from "../data-structures/inventory";
import IScanner = Scanner.IScanner;

// A single looped antenna intended for reading many tags over time but not nessarally all at the same time..
export class BulkScanner implements IScanner
{
    public reader: GenericReader;
    public lock: boolean = false;

    constructor(readerId: ReaderType) {

        this.reader = new GenericReader(readerId);        
    }

    public async init() {

      await this.reader.init();
    }

    public async scan() {

        if (!this.lock) {

            this.lock = true;

            // Reinitialise list of new tags
            this.newTags = [];
            this.newTags[0] = new Inventory();
            this.newTags[0].UID = [];

            var readerResponse: Inventory[] = await this.reader.getInventory();

            // Found something?
            if (readerResponse && readerResponse.length !== 0 && readerResponse[0].hasOwnProperty('UID')) {

              var thisRead = readerResponse[0].UID;
              // Is first read?
              if (this.previousScan.length !== 0) {

                var lastRead = this.previousScan[0].UID;
                // For every tag just read on the single antenna
                for (var i in thisRead) {

                  var found: boolean = false;

                  // Compare to every tag stored in memory
                  for (var j: number = 0; j < lastRead.length; j++) {

                    if (lastRead[j] === thisRead[i]) {

                      found = true;
                      break;
                    }
                  }
                  if (!found) {

                    lastRead.push(thisRead[i]);
                    this.newTags[0].UID.push(thisRead[i]);
                    this.change = true;
                  }
                }
              } else {

                  this.previousScan = readerResponse;
                  this.newTags = readerResponse;
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
      this.newTags = [];
      this.previousScan = [];
    }

    public newTags: Inventory[] = [];
    public previousScan: Inventory[] = [];
    public change: boolean = false;
}