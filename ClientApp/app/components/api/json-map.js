"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Performs a mapping of the "RESTful API JSON" object structure to the equivalent client-side object
var container_1 = require("../items/containers/container");
var primary_container_1 = require("../items/containers/primary_container");
var history_type_1 = require("../items/history/history-type");
var material_1 = require("../items/materials/material");
var batch_1 = require("../items/materials/batch/batch");
var user_1 = require("../items/users/user");
var order_1 = require("../items/distribution/order");
var Contents_1 = require("../items/distribution/contents/Contents");
var picklistitem_1 = require("../items/picklist/picklistitem");
var inventory_1 = require("../reader/data-structures/inventory");
var tag_identity_1 = require("../reader/data-structures/tag-identity");
var moment = require("moment");
var Material1 = require("../items/materials/material");
var MaterialInfo = Material1.MaterialInfo;
var material_2 = require("../items/materials/material");
var container_ident_1 = require("../items/containers/container-ident");
var ContainerStatus_1 = require("../items/history/ContainerStatus");
var JSON_version = /** @class */ (function () {
    function JSON_version() {
    }
    return JSON_version;
}());
exports.JSON_version = JSON_version;
// Convert the JSON object structure to the internal version structure
function Server_ConvertToVersion(items) {
    var version = "";
    // Get the major version
    if (items && items.hasOwnProperty('Version_Major')) {
        version = items.Version_Major;
    }
    else {
        // Missing parameter error
        console.log("Convert to version: invalid JSON format or missing major version parameter");
    }
    // Get the minor version
    if (items && items.hasOwnProperty('Version_Minor')) {
        version += "." + items.Version_Minor;
    }
    else {
        // Missing parameter error
        console.log("Convert to version: invalid JSON format or missing minor version parameter");
    }
    return version;
}
exports.Server_ConvertToVersion = Server_ConvertToVersion;
var JSON_user = /** @class */ (function () {
    function JSON_user() {
        this.Sites = [];
        this.Groups = [];
    }
    return JSON_user;
}());
exports.JSON_user = JSON_user;
// Convert the JSON object structure to the internal extended User[] structure
function Server_ConvertToUsers(items) {
    var users = [];
    if (items && items.hasOwnProperty('Users')) {
        var item;
        for (var _i = 0, _a = items.Users; _i < _a.length; _i++) {
            item = _a[_i];
            var user = new user_1.User();
            user.uid = item.Id.toString();
            user.userName = item.Username;
            user.firstName = item.FirstName;
            user.lastName = item.LastName;
            user.email = item.Email;
            user.addedDate = moment(item.AddedDate).format("MM/DD/YYYY HH:mm");
            user.updatedDate = moment(item.UpdatedDate).format("MM/DD/YYYY HH:mm");
            user.isAdministrator = item.IsAdmin;
            user.password = undefined;
            users.push(user);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to users: invalid JSON format or undefined parameter");
    }
    return users;
}
exports.Server_ConvertToUsers = Server_ConvertToUsers;
// Convert the JSON object structure to the internal extended User structure
function Server_ConvertToUser(item) {
    var user = new user_1.User();
    if (item) {
        user.uid = item.Id;
        user.userName = item.Username;
        user.firstName = item.FirstName;
        user.lastName = item.LastName;
        user.email = item.Email;
        user.addedDate = moment(item.AddedDate).format("MM/DD/YYYY HH:mm");
        user.updatedDate = moment(item.UpdatedDate).format("MM/DD/YYYY HH:mm");
        user.isAdministrator = item.IsAdmin;
        user.password = undefined;
    }
    return user;
}
exports.Server_ConvertToUser = Server_ConvertToUser;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromUser(user) {
    var item = new JSON_user();
    if (user) {
        item.Id = user.uid ? parseInt(user.uid) : 0;
        item.Username = user.userName;
        item.FirstName = user.firstName;
        item.LastName = user.lastName;
        item.Email = user.email;
        item.AddedDate = moment(user.addedDate).toDate();
        item.UpdatedDate = moment(user.updatedDate).toDate();
        item.Password = user.password ? user.password : null;
        item.IsAdmin = user.isAdministrator;
        item.Sites.push(user.site);
        // item.Groups.push("Public Health England PHE"); // TODO - Hardcoded for now add facility to add groups 
    }
    else {
        // Undefined parameter error
        console.log("Convert from user: undefined parameter");
        return undefined;
    }
    return item;
}
exports.Server_ConvertFromUser = Server_ConvertFromUser;
var JSON_generalType = /** @class */ (function () {
    function JSON_generalType() {
    }
    return JSON_generalType;
}());
exports.JSON_generalType = JSON_generalType;
// Convert the JSON object structure to the internal General Type structures
function Server_ConvertToGeneralTypes(items) {
    var generalTypes = [];
    if (items && items.hasOwnProperty("Types")) {
        var item = void 0;
        for (var _i = 0, _a = items.Types; _i < _a.length; _i++) {
            item = _a[_i];
            var gType = new container_ident_1.GeneralType();
            gType.ident = item.Ident;
            gType.description = item.Description;
            // Add to the list
            generalTypes.push(gType);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to general types: invalid JSON format or undefined parameter");
    }
    return generalTypes;
}
exports.Server_ConvertToGeneralTypes = Server_ConvertToGeneralTypes;
var JSON_subtype = /** @class */ (function () {
    function JSON_subtype() {
    }
    return JSON_subtype;
}());
exports.JSON_subtype = JSON_subtype;
// Convert the JSON object structure to the internal General Type structures
function Server_ConvertToSubtypes(items) {
    var subtypes = [];
    if (items && items.hasOwnProperty("Subtypes")) {
        var item = void 0;
        for (var _i = 0, _a = items.Subtypes; _i < _a.length; _i++) {
            item = _a[_i];
            var sType = new container_ident_1.Subtype();
            sType.tagIdent = item.TagIdent;
            sType.description = item.Description;
            sType.isRfidEnabled = item.IsRFIDEnabled;
            // Add to the list
            subtypes.push(sType);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to general types: invalid JSON format or undefined parameter");
    }
    return subtypes;
}
exports.Server_ConvertToSubtypes = Server_ConvertToSubtypes;
var JSON_container = /** @class */ (function () {
    function JSON_container() {
    }
    return JSON_container;
}());
exports.JSON_container = JSON_container;
// Convert the JSON object structure to the internal Container structure
function Server_ConvertToGenericContainer(items) {
    var containers = [];
    if (items && items.hasOwnProperty("Containers")) {
        var item;
        for (var _i = 0, _a = items.Containers; _i < _a.length; _i++) {
            item = _a[_i];
            var container = new container_1.Container();
            container.uid = item.Uid;
            container.name = item.Description;
            container.type = item.Ident;
            container.addedDate = item.InceptDate !== null ? moment(item.InceptDate).format("MM/DD/YYYY HH:mm") : "";
            container.containsQty = item.ContainsQtty;
            container.containsType = item.ContainsIdent;
            // Add to the list
            containers.push(container);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to container: invalid JSON format or undefined parameter");
    }
    return containers;
}
exports.Server_ConvertToGenericContainer = Server_ConvertToGenericContainer;
// Convert the JSON object structure to the internal Container structure
function Server_ConvertToSingleGenericContainer(item) {
    var container = new container_1.Container();
    container.uid = item.Uid;
    container.name = item.Description;
    container.type = item.Ident;
    container.addedDate = item.InceptDate !== null ? moment(item.InceptDate).format("MM/DD/YYYY HH:mm") : "";
    container.containsQty = item.ContainsQtty;
    container.containsType = item.ContainsIdent;
    return container;
}
exports.Server_ConvertToSingleGenericContainer = Server_ConvertToSingleGenericContainer;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromGenericContainer(container) {
    var item = new JSON_container();
    if (container) {
        item.Uid = container.uid;
        item.Description = container.name;
        item.Ident = container.type;
        item.InceptDate = moment(container.addedDate).toDate();
        item.ContainsQtty = container.containsQty;
        item.ContainsIdent = container.containsType;
        item.TagIdent = container.tagIdent;
    }
    else {
        // Undefined parameter error
        console.log("Convert from container: undefined parameter");
        return undefined;
    }
    return item;
}
exports.Server_ConvertFromGenericContainer = Server_ConvertFromGenericContainer;
var JSON_PrimaryContainer = /** @class */ (function () {
    function JSON_PrimaryContainer() {
    }
    return JSON_PrimaryContainer;
}());
exports.JSON_PrimaryContainer = JSON_PrimaryContainer;
// Convert the JSON object structure to the internal structure
function Server_ConvertToPrimaryContainers(items) {
    var samples = [];
    if (items && items.hasOwnProperty('PrimaryContainers')) {
        for (var _i = 0, _a = items.PrimaryContainers; _i < _a.length; _i++) {
            var item = _a[_i];
            var sample = new primary_container_1.PrimaryContainer();
            sample.uid = item.Uid;
            sample.labelled = item.Description;
            sample.position = item.Position;
            sample.batchName = item.BatchName;
            var it = 0;
            sample.configurableField1 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            sample.configurableField2 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            sample.configurableField3 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            sample.configurableField4 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            // Add to the list
            samples.push(sample);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to Primary Containers: invalid JSON format or undefined parameter");
    }
    return samples;
}
exports.Server_ConvertToPrimaryContainers = Server_ConvertToPrimaryContainers;
// Convert the JSON object structure to the internal structure
function Server_ConvertToContainerType(items) {
    var types = [];
    if (items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item) {
                // Add to the list
                types.push(item);
            }
        }
    }
    else {
        // Undefined parameter error
        console.log("Convert to container type: undefined parameter");
    }
    return types;
}
exports.Server_ConvertToContainerType = Server_ConvertToContainerType;
var JSON_history = /** @class */ (function () {
    function JSON_history() {
    }
    return JSON_history;
}());
exports.JSON_history = JSON_history;
// Convert the JSON object structure to the internal Vial structure
function Server_ConvertToHistory(items) {
    var history = [];
    if (items && items.hasOwnProperty('History')) {
        for (var _i = 0, _a = items.History; _i < _a.length; _i++) {
            var item = _a[_i];
            var historyItem = new history_type_1.HistoryType();
            historyItem.userName = item.Username;
            historyItem.event = item.Reason;
            historyItem.location = item.Location;
            historyItem.date = moment(item.Date).format("MM/DD/YYYY HH:mm");
            // Add to the list
            history.push(historyItem);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to history: invalid JSON format or undefined parameter");
    }
    return history;
}
exports.Server_ConvertToHistory = Server_ConvertToHistory;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromHistory(history) {
    var item = new JSON_history();
    if (history) {
        item.username = history.userName;
        item.reason = history.event;
        item.location = history.location;
        item.Date = moment(history.date).toDate();
    }
    else {
        // Undefined parameter error
        console.log("Convert from history item: undefined parameter");
        return undefined;
    }
    return item;
}
exports.Server_ConvertFromHistory = Server_ConvertFromHistory;
var JSON_materialExt = /** @class */ (function () {
    function JSON_materialExt() {
    }
    return JSON_materialExt;
}());
exports.JSON_materialExt = JSON_materialExt;
function Server_ConvertToMaterialInfo(items) {
    var materialInfos = [];
    if (items) {
        if (items.hasOwnProperty('MaterialInfo')) {
            for (var _i = 0, _a = items.MaterialInfo; _i < _a.length; _i++) {
                var item = _a[_i];
                var materialInfo = new MaterialInfo();
                materialInfo.field = item.AttributeFieldName;
                materialInfo.value = item.AttributeValueName;
                materialInfos.push(materialInfo);
            }
        }
    }
    return materialInfos;
}
exports.Server_ConvertToMaterialInfo = Server_ConvertToMaterialInfo;
// Get Map of material items where the key is the header and the values are the values
function Server_GetMaterialHeaders(data) {
    // Find the index for material info
    var itemType;
    var properties = Object.getOwnPropertyNames(data);
    for (var i in properties) {
        var name = properties[i];
        for (var _i = 0, _a = data[name]; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.hasOwnProperty('Material')) {
                itemType = name;
                break;
            }
        }
    }
    var items = data[itemType];
    var Material = new Map();
    if (items) {
        for (var _b = 0, _c = items[0].Material; _b < _c.length; _b++) {
            var item = _c[_b];
            if (item !== null) {
                Material.set(item.AttributeFieldName, item.AttributeValueName);
            }
        }
    }
    return Material;
}
exports.Server_GetMaterialHeaders = Server_GetMaterialHeaders;
// Get Map of material items where the key is the header and the values are the values
function Server_GetMaterialFields(items) {
    var Material = new Map();
    if (items) {
        for (var _i = 0, _a = items.Material; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item !== null) {
                Material.set(item.AttributeFieldName, item.AttributeValueName);
            }
        }
    }
    return Material;
}
exports.Server_GetMaterialFields = Server_GetMaterialFields;
// Convert the JSON object structure to the internal Material structure
function Server_ConvertToMaterial(items) {
    var materials = [];
    if (items && items.hasOwnProperty('Batches')) {
        for (var _i = 0, _a = items.Batches; _i < _a.length; _i++) {
            var item = _a[_i];
            var material = new material_1.Material();
            material.uid = item.Uid;
            material.name = item.Name;
            var it = 0;
            material.configurableField_1 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            material.configurableField_2 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            material.configurableField_3 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            material.configurableField_4 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
            material.cryoSeedQty = item.CryoSeedQty;
            material.testedSeedQty = item.TestedSeedQty;
            material.sDSeedQty = item.SDSeedQty;
            // Add to the list
            materials.push(material);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to material: invalid JSON format or undefined parameter");
    }
    return materials;
}
exports.Server_ConvertToMaterial = Server_ConvertToMaterial;
// Convert the JSON object structure to the internal Material structure
function Server_ConvertToSingleMaterial(item) {
    var material = new material_1.Material();
    material.uid = item.Uid;
    material.name = item.Name;
    var it = 0;
    material.configurableField_1 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
    material.configurableField_2 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
    material.configurableField_3 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
    material.configurableField_4 = it < item.Material.length ? item.Material[it++].AttributeValueName : null;
    material.notes = item.Notes;
    material.cryoSeedQty = item.CryoSeedQty;
    material.testedSeedQty = item.TestedSeedQty;
    material.sDSeedQty = item.SDSeedQty;
    return material;
}
exports.Server_ConvertToSingleMaterial = Server_ConvertToSingleMaterial;
var JSON_Batch = /** @class */ (function () {
    function JSON_Batch() {
    }
    return JSON_Batch;
}());
exports.JSON_Batch = JSON_Batch;
// Convert the JSON object structure to the internal extended Material structure
function Server_ConvertToMaterialExtended(item) {
    var material = new material_2.MaterialBatch();
    if (item) {
        material.uid = item.Uid;
        material.name = item.Name;
        material.date = item.Date;
        if (item.hasOwnProperty('Material')) {
            material.materialInfo = [];
            for (var _i = 0, _a = item.Material; _i < _a.length; _i++) {
                var info = _a[_i];
                var mInfo = new MaterialInfo();
                mInfo.field = info.AttributeFieldName;
                mInfo.value = info.AttributeValueName;
                material.materialInfo.push(mInfo);
            }
        }
        material.cryoSeedQty = item.CryoSeedQty;
        material.testedSeedQty = item.TestedSeedQty;
        material.sDSeedQty = item.SDSeedQty;
        material.sampleQty = item.SampleQty;
        material.notes = item.Notes;
    }
    return material;
}
exports.Server_ConvertToMaterialExtended = Server_ConvertToMaterialExtended;
// Convert the JSON object structure to the internal extended Material structure
function Server_ConvertManyToMaterialExtended(items) {
    var materials = [];
    if (items && items.hasOwnProperty('Batches')) {
        for (var _i = 0, _a = items.Batches; _i < _a.length; _i++) {
            var item = _a[_i];
            var material = new material_2.MaterialBatch();
            if (item) {
                material.uid = item.Uid;
                material.name = item.Name;
                material.date = item.Date;
                if (item.hasOwnProperty('Material')) {
                    material.materialInfo = [];
                    for (var _b = 0, _c = item.Material; _b < _c.length; _b++) {
                        var info = _c[_b];
                        var mInfo = new MaterialInfo();
                        mInfo.field = info.AttributeFieldName;
                        mInfo.value = info.AttributeValueName;
                        material.materialInfo.push(mInfo);
                    }
                }
                material.sampleQty = item.SampleQty;
                material.notes = item.Notes;
                material.cryoSeedQty = item.CryoSeedQty;
                material.testedSeedQty = item.TestedSeedQty;
                material.sDSeedQty = item.SDSeedQty;
            }
            materials.push(material);
        }
    }
    return materials;
}
exports.Server_ConvertManyToMaterialExtended = Server_ConvertManyToMaterialExtended;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromMaterialExtended(material) {
    var batch = new JSON_Batch();
    if (material) {
        batch.Uid = material.uid;
        batch.Name = material.name;
        batch.Material = [];
        if (material.hasOwnProperty('materialInfo')) {
            batch.Material = [];
            for (var _i = 0, _a = material.materialInfo; _i < _a.length; _i++) {
                var info = _a[_i];
                var mInfo = {
                    "AttributeFieldName": info.field,
                    "AttributeValueName": info.value
                };
                batch.Material.push(mInfo);
            }
        }
        batch.Notes = material.notes;
        batch.CryoSeedQty = material.cryoSeedQty;
        batch.TestedSeedQty = material.testedSeedQty;
        batch.SDSeedQty = material.sDSeedQty;
    }
    else {
        // Undefined parameter error
        console.log("Convert from material (detailed): undefined parameter");
        return undefined;
    }
    return batch;
}
exports.Server_ConvertFromMaterialExtended = Server_ConvertFromMaterialExtended;
// TODO FIX THIS FUDGE!
function Server_ConvertToPrimaryContainer(item) {
    return item;
}
exports.Server_ConvertToPrimaryContainer = Server_ConvertToPrimaryContainer;
// Convert the JSON object structure to the internal Batch structure
function Server_ConvertToBatch(items) {
    var batches = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        if (items) {
            for (var _i = 0, _a = items.Aliquots; _i < _a.length; _i++) {
                var item = _a[_i];
                var aliquot = new batch_1.Batch();
                aliquot.uid = item.Uid;
                aliquot.primary_description = item.PrimaryDescription;
                //aliquot.position = item.Position;
                //  aliquot.status = item.Status;
                aliquot.parent_description = item.ParentDescription;
                aliquot.gParent_description = item.GrandParentDescription;
                aliquot.ggParent_description = item.GreatGrandParentDescription;
                aliquot.site = item.Site;
                batches.push(aliquot);
            }
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to batch: invalid JSON format or undefined parameter");
    }
    return batches;
}
exports.Server_ConvertToBatch = Server_ConvertToBatch;
// Convert the JSON object structure to the internal Pick List structure
function Server_ConvertToPicklist(items) {
    var picklist = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        for (var _i = 0, _a = items.Aliquots; _i < _a.length; _i++) {
            var item = _a[_i];
            var picklistItem = new picklistitem_1.PickListItem();
            picklistItem.uid = item.Uid;
            picklistItem.batchName = item.BatchName;
            picklistItem.primary_description = item.PrimaryDescription;
            picklistItem.position = item.Position;
            picklistItem.parent_description = item.ParentDescription;
            picklistItem.gParent_description = item.GrandParentDescription;
            picklistItem.ggParent_description = item.GreatGrandParentDescription;
            // Add to the list
            picklist.push(picklistItem);
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to picklist: invalid JSON format or undefined parameter");
    }
    return picklist;
}
exports.Server_ConvertToPicklist = Server_ConvertToPicklist;
// Convert the JSON object structure to the internal material type structure
function Server_ConvertToMaterialType(items) {
    var types = [];
    if (items) {
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            if (item) {
                // Add to the list
                types.push(item);
            }
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to material type: invalid JSON format or undefined parameter");
    }
    return types;
}
exports.Server_ConvertToMaterialType = Server_ConvertToMaterialType;
var JSON_contentsList = /** @class */ (function () {
    function JSON_contentsList() {
    }
    return JSON_contentsList;
}());
exports.JSON_contentsList = JSON_contentsList;
function Server_ConvertToContents(items) {
    var contents = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        if (items) {
            for (var _i = 0, _a = items.Aliquots; _i < _a.length; _i++) {
                var item = _a[_i];
                var contentsItem = new Contents_1.Contents();
                contentsItem.uid = item.Uid;
                contentsItem.primary_description = item.PrimaryDescription;
                contentsItem.BatchName = item.BatchName;
                contentsItem.parent_description = item.ParentDescription;
                contentsItem.gParent_description = item.GrandParentDescription;
                contentsItem.ggParent_description = item.GreatGrandParentDescription;
                contents.push(contentsItem);
            }
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to order: invalid JSON format or undefined parameter");
    }
    return contents;
}
exports.Server_ConvertToContents = Server_ConvertToContents;
var JSON_ordersList = /** @class */ (function () {
    function JSON_ordersList() {
    }
    return JSON_ordersList;
}());
exports.JSON_ordersList = JSON_ordersList;
var JSON_ordersExt = /** @class */ (function () {
    function JSON_ordersExt() {
    }
    return JSON_ordersExt;
}());
exports.JSON_ordersExt = JSON_ordersExt;
// Convert the JSON object structure to the internal extended Order structure
function Server_ConvertToOrder(items) {
    var orders = [];
    if (items && items.hasOwnProperty('Orders')) {
        if (items) {
            for (var _i = 0, _a = items.Orders; _i < _a.length; _i++) {
                var item = _a[_i];
                var orderItem = new order_1.Order();
                orderItem.uid = item.Uid;
                orderItem.consignment_no = item.ConsignmentNo;
                orderItem.sender = item.Sender;
                orderItem.recipient = item.Recipient;
                orderItem.sample_qty = item.SampleQty;
                orderItem.status = item.Status;
                orders.push(orderItem);
            }
        }
    }
    else {
        // Undefined / invalid parameter error
        console.log("Convert to order: invalid JSON format or undefined parameter");
    }
    return orders;
}
exports.Server_ConvertToOrder = Server_ConvertToOrder;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromOrder(order) {
    var item = new JSON_ordersList();
    if (order) {
        item.Uid = order.uid;
        item.ConsignmentNo = order.consignment_no;
        item.Sender = order.sender;
        item.Recipient = order.recipient;
        item.SampleQty = order.sample_qty;
        item.Status = order.status;
    }
    else {
        // Undefined parameter error
        console.log("Convert from user: undefined parameter");
        return undefined;
    }
    return item;
}
exports.Server_ConvertFromOrder = Server_ConvertFromOrder;
// Convert the JSON object structure to the internal Order structure
function Server_ConvertToSingleOrder(item) {
    var orderItem = new order_1.Order();
    orderItem.uid = item.Uid;
    orderItem.consignment_no = item.ConsignmentNo;
    orderItem.sender = item.Sender;
    orderItem.recipient = item.Recipient;
    orderItem.sample_qty = item.SampleQty;
    orderItem.status = item.Status;
    return orderItem;
}
exports.Server_ConvertToSingleOrder = Server_ConvertToSingleOrder;
// Converts from the RESTful API JSON structure to the internal object structure
function Server_ConvertFromOrderExtended(order) {
    var item = new JSON_ordersExt();
    if (order) {
        item.Uid = order.uid;
        item.ConsignmentNo = order.consignment_no;
        item.Sender = order.sender;
        item.Recipient = order.recipient;
        item.OrderedDate = order.ordered_date;
        item.DispatchedDate = order.dispatched_date;
        item.ArrivedDate = order.arrived_date;
        item.SampleQty = order.sample_qty;
        item.Status = order.status;
        item.Notes = order.notes;
    }
    else {
        // Undefined parameter error
        console.log("Convert from order (detailed): undefined parameter");
        return undefined;
    }
    return item;
}
exports.Server_ConvertFromOrderExtended = Server_ConvertFromOrderExtended;
// Convert the JSON object structure to the internal extended Order structure
function Server_ConvertToOrderExtended(item) {
    var order = new order_1.Order();
    if (item) {
        order.uid = item.Uid; //item.UID.toString();
        order.consignment_no = item.ConsignmentNo;
        order.sender = item.Sender;
        order.recipient = item.Recipient;
        order.ordered_date = item.OrderedDate === null ? null : item.OrderedDate;
        order.dispatched_date = item.DispatchedDate === null ? null : item.DispatchedDate;
        order.arrived_date = item.ArrivedDate === null ? null : item.ArrivedDate;
        order.sample_qty = item.SampleQty;
        order.status = item.Status;
        order.notes = item.Notes;
    }
    return order;
}
exports.Server_ConvertToOrderExtended = Server_ConvertToOrderExtended;
var JSON_Inventory = /** @class */ (function () {
    function JSON_Inventory() {
    }
    return JSON_Inventory;
}());
exports.JSON_Inventory = JSON_Inventory;
// Response from reader getInventory command
function convertToInventory(items) {
    var inventory = [];
    //  var item: JSON_Inventory;
    if (items) {
        for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
            var item = items_3[_i];
            var antennaInv = new inventory_1.Inventory();
            // Set the antenna number
            antennaInv.antenna = item.Antenna;
            antennaInv.UID = [];
            // Set each tag found on the antenna
            if (item.hasOwnProperty("UID")) {
                for (var _a = 0, _b = item.UID; _a < _b.length; _a++) {
                    var uid = _b[_a];
                    antennaInv.UID.push(uid);
                }
            }
            inventory.push(antennaInv);
        }
    }
    return inventory;
}
exports.convertToInventory = convertToInventory;
var JSON_MaterialInfo = /** @class */ (function () {
    function JSON_MaterialInfo() {
    }
    return JSON_MaterialInfo;
}());
exports.JSON_MaterialInfo = JSON_MaterialInfo;
var JSON_RFID = /** @class */ (function () {
    function JSON_RFID() {
    }
    return JSON_RFID;
}());
exports.JSON_RFID = JSON_RFID;
function Server_ConvertToTagIdentity(item) {
    var tagIdentity = new tag_identity_1.TagIdentity();
    if (item) {
        tagIdentity.uid = item.Uid;
        tagIdentity.position = item.Position;
        tagIdentity.description = item.Description;
        tagIdentity.containerType = item.ContainerType;
        tagIdentity.batchName = item.BatchName;
        if (item.hasOwnProperty("ParentUidDescription")) {
            tagIdentity.parentUidDescription = new Map();
            for (var key in item.ParentUidDescription) {
                var value = item.ParentUidDescription[key];
                tagIdentity.parentUidDescription.set(key, value);
            }
        }
    }
    else {
        // Undefined parameter error
        console.log("Convert to TagIdentity: undefined parameter");
        return undefined;
    }
    return tagIdentity;
}
exports.Server_ConvertToTagIdentity = Server_ConvertToTagIdentity;
function Server_ConvertInventoryToTagIdentity(item) {
    var tagIdentity = new tag_identity_1.TagIdentity();
    if (item) {
        tagIdentity.uid = item.UID[0];
        tagIdentity.position = item.antenna;
    }
    else {
        // Undefined parameter error
        console.log("Convert to TagIdentity: undefined parameter");
        return undefined;
    }
    return tagIdentity;
}
exports.Server_ConvertInventoryToTagIdentity = Server_ConvertInventoryToTagIdentity;
function Server_ConvertToContainerStatus(items, status) {
    var containerStatuses = [];
    if (items) {
        for (var _i = 0, items_4 = items; _i < items_4.length; _i++) {
            var item = items_4[_i];
            var containerStatus = new ContainerStatus_1.ContainerStatus();
            containerStatus.containerUid = item.Uid;
            containerStatus.status = status;
            containerStatuses.push(containerStatus);
        }
    }
    return containerStatuses;
}
exports.Server_ConvertToContainerStatus = Server_ConvertToContainerStatus;
function Server_GetCrops(item) {
    var unique = item.map(function (item) { return item.configurableField_1; })
        .filter(function (value, index, self) { return self.indexOf(value) === index; });
    return unique;
}
exports.Server_GetCrops = Server_GetCrops;
//# sourceMappingURL=json-map.js.map