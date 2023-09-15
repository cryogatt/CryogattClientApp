import { HttpClient, json } from 'aurelia-fetch-client';
import { AuthService } from '../auth/auth-service';
import { Resources } from "../resources";
import { ReaderType } from '../reader/reader-types';

var readerClient = new HttpClient();
var $ = require('jquery');

// Read specific reader
export function Reader_Read(readerId: string): Promise<any> {

    // List configured reader
    return new Promise<any>(() => {
        return {
            Id: 5,
            AntennaQuantity: 100,
            Name: "Cryogatt 10* 10 Vial Reader P/N R10102",
            TagsPerAntenna: 1,
            URL: ""
        };
    });
}

// Perform ISO 15693 Inventory
export function GetReader_InventoryPath(readerId: string): string {

    // Fetch the data using the RFID Reader Web API
    if (readerId === ReaderType.CRYOGATT_R10102.toString())
        return ('Cold10102Reader/GetTags');

    // Default
    return ('readers/' + readerId + '/tags');
}

// Perform ISO 15693 Block 0 (Ident)
export function GetReader_IdentPath(readerId: string, tagId: string, antennaNo?: number): string {

    if (readerId === ReaderType.CRYOGATT_R10102.toString())
        return ('Cold10102Reader/' + tagId + '/blocks/' + 0);

    // Fetch the data using the RFID Reader Web API
    if (!antennaNo) {

    // Default to antenna 1
    return ('readers/' + readerId + '/tags/' + tagId);
    } else {

    return ('readers/' + readerId + '/tags/' + tagId + '?antenna=' + antennaNo);
    }
}

