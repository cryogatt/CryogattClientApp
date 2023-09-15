"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_fetch_client_1 = require("aurelia-fetch-client");
var reader_types_1 = require("../reader/reader-types");
var readerClient = new aurelia_fetch_client_1.HttpClient();
var $ = require('jquery');
// Read specific reader
function Reader_Read(readerId) {
    // List configured reader
    return new Promise(function () {
        return {
            Id: 5,
            AntennaQuantity: 100,
            Name: "Cryogatt 10* 10 Vial Reader P/N R10102",
            TagsPerAntenna: 1,
            URL: ""
        };
    });
}
exports.Reader_Read = Reader_Read;
// Perform ISO 15693 Inventory
function GetReader_InventoryPath(readerId) {
    // Fetch the data using the RFID Reader Web API
    if (readerId === reader_types_1.ReaderType.CRYOGATT_R10102.toString())
        return ('Cold10102Reader/GetTags');
    // Default
    return ('readers/' + readerId + '/tags');
}
exports.GetReader_InventoryPath = GetReader_InventoryPath;
// Perform ISO 15693 Block 0 (Ident)
function GetReader_IdentPath(readerId, tagId, antennaNo) {
    if (readerId === reader_types_1.ReaderType.CRYOGATT_R10102.toString())
        return ('Cold10102Reader/' + tagId + '/blocks/' + 0);
    // Fetch the data using the RFID Reader Web API
    if (!antennaNo) {
        // Default to antenna 1
        return ('readers/' + readerId + '/tags/' + tagId);
    }
    else {
        return ('readers/' + readerId + '/tags/' + tagId + '?antenna=' + antennaNo);
    }
}
exports.GetReader_IdentPath = GetReader_IdentPath;
//# sourceMappingURL=reader-api-path-broker.js.map