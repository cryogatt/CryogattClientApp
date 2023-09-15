import Reader1 = require("../api/reader");
import Readertypes = require("./reader-types");
import ReaderType = Readertypes.ReaderType;
import Reader_Inventory = Reader1.Reader_Inventory;
import Jsonmap = require("../api/json-map");
import * as toastr from 'toastr';

// Model representing a generic reader whose properties are populated by a request the reader api
export class GenericReader {

    public readerId: string;

    public id: number;
    public type: number;
    public url: string;
    public antennaQuantity: number;
    public tagsPerAntenna: number;

    constructor(readerId: ReaderType ) {

        this.readerId = String(readerId);
    }

    public async init() {

      await this.setProperties();
    }

    // Scan reader and get its inventory from the service
    public async getInventory(): Promise<any> {

        return await Reader_Inventory(this.readerId).then(data => {

          return Jsonmap.convertToInventory(data);
        }).catch((error => {

          toastr.error("Cannot connect to reader! ", error.toString());
          throw error;
        }));
    }

    // From the service response populate reader attributes
    private async setProperties() {

        await Reader1.Reader_Read(this.readerId).then(data => {

            if (data) {

                this.id = data.ID;
                this.type = data.Type;
                this.url = data.URL;
                this.antennaQuantity = data.AntennaQuantity;
                this.tagsPerAntenna = data.TagsPerAntenna;
            }
        }).catch(error => {

          // An error has occurred, e.g. no data 
          toastr.error("Cannot connect to reader! ", error.toString());
        });
    }
}