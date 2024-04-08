// Performs a mapping of the "RESTful API JSON" object structure to the equivalent client-side object
import { Container } from '../items/containers/container';
import { PrimaryContainer } from '../items/containers/primary_container';
import { HistoryType } from '../items/history/history-type';
import { Material } from '../items/materials/material';
import { Batch } from '../items/materials/batch/batch';
import { User } from '../items/users/user';
import { Order } from '../items/distribution/order';
import { Contents } from '../items/distribution/contents/Contents';
import { PickListItem as PickListItem } from '../items/picklist/picklistitem';
import { Inventory } from "../reader/data-structures/inventory";
import { TagIdentity, /*MaterialInfo*/ } from '../reader/data-structures/tag-identity';
import * as moment from 'moment';
import Material1 = require("../items/materials/material");
import MaterialInfo = Material1.MaterialInfo;
import { MaterialBatch } from '../items/materials/material';
import { GeneralType, Subtype } from '../items/containers/container-ident';
import { ContainerStatus } from '../items/history/ContainerStatus';

export class JSON_version {
    public majorVersion: number;
    public minorVersion: number;
}

// Convert the JSON object structure to the internal version structure
export function Server_ConvertToVersion(items: any): string {

    var version: string = "";

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

export class JSON_user {
    public Id: number;
    public Username: string;
    public FirstName: string;
    public LastName: string;
    public Email: string;
  //  public LastLogin: Date;
    public AddedDate: Date;
    public UpdatedDate: Date;
    public Password: string;
    public IsAdmin: boolean;
    public Sites: string[] = [];
    public Groups: string[] = [];
}

// Convert the JSON object structure to the internal extended User[] structure
export function Server_ConvertToUsers(items: any): User[] {

    var users: User[] = [];
    if (items && items.hasOwnProperty('Users')) {
        var item: JSON_user;
        for (item of items.Users) {
            var user: User = new User();
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

// Convert the JSON object structure to the internal extended User structure
export function Server_ConvertToUser(item: any): User {

    var user: User = new User();
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

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromUser(user: User): JSON_user {

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

export class JSON_generalType {

  public Ident: number;
  public Description: string;
}

// Convert the JSON object structure to the internal General Type structures
export function Server_ConvertToGeneralTypes(items: any): GeneralType[] {

  let generalTypes: GeneralType[] = [];
  if (items && items.hasOwnProperty("Types")) {
    let item: JSON_generalType;
    for (item of items.Types) {
      let gType = new GeneralType();

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

export class JSON_subtype {

  public TagIdent: number;
  public Description: string;
  public IsRFIDEnabled: boolean;
}

// Convert the JSON object structure to the internal General Type structures
export function Server_ConvertToSubtypes(items: any): Subtype[] {

  let subtypes: Subtype[] = [];
  if (items && items.hasOwnProperty("Subtypes")) {
    let item: JSON_subtype;
    for (item of items.Subtypes) {
      let sType = new Subtype();

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

export class JSON_container {
    public Uid: string;
    public Description: string;
    public Ident: string;
    public InceptDate: Date;
    public ContainsQtty: number;
    public ContainsIdent: string;
    public TagIdent: Number;
}

// Convert the JSON object structure to the internal Container structure
export function Server_ConvertToGenericContainer(items: any): Container[] {

    var containers: Container[] = [];
    if (items && items.hasOwnProperty("Containers")) {
        var item: JSON_container;
        for (item of items.Containers) {
            var container = new Container();

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

// Convert the JSON object structure to the internal Container structure
export function Server_ConvertToSingleGenericContainer(item: any): Container {

    var container = new Container();

    container.uid = item.Uid;
    container.name = item.Description;
    container.type = item.Ident;
    container.addedDate = item.InceptDate !== null ? moment(item.InceptDate).format("MM/DD/YYYY HH:mm") : "";
    container.containsQty = item.ContainsQtty;
    container.containsType = item.ContainsIdent;

    return container;
}

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromGenericContainer(container: Container): JSON_container {

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

export class JSON_PrimaryContainer {
    public Uid: string;
    public Description: string;
    public Position: number; 
    public InceptDate: Date;
    // Material
    public Sample_Type: Date;
    public Collection_Date: Date;
    //
    public TagIdent: number;
    public BatchId: number;
}

// Convert the JSON object structure to the internal structure
export function Server_ConvertToPrimaryContainers(items: any): PrimaryContainer[] {

    var samples: PrimaryContainer[] = [];

    if (items && items.hasOwnProperty('PrimaryContainers')) {
      for (var item of items.PrimaryContainers) {

            var sample = new PrimaryContainer();

            sample.uid = item.Uid;

            sample.labelled = item.Description;

            sample.position = item.Position;

            sample.batchName = item.BatchName;
               
            var it: number = 0;

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

// Convert the JSON object structure to the internal structure
export function Server_ConvertToContainerType(items: any): string[] {

    var types: string[] = [];
    if (items) {
        for (var item of items) {
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

export class JSON_history {
    public username: string;
    public reason: string;
    public location: string;
    public Date: Date;
}

// Convert the JSON object structure to the internal Vial structure
export function Server_ConvertToHistory(items: any): HistoryType[] {

    var history: HistoryType[] = [];
    if (items && items.hasOwnProperty('History')) {
        for (var item of items.History) {
            var historyItem = new HistoryType();

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

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromHistory(history: HistoryType): JSON_history {

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

export class JSON_materialExt {
    public id: number;
    public dic;
}

export function Server_ConvertToMaterialInfo(items: any): MaterialInfo[] {

  let materialInfos: MaterialInfo[] = [];

  if (items) {

    if (items.hasOwnProperty('MaterialInfo')) {

      for (let item of items.MaterialInfo) {

        let materialInfo = new MaterialInfo();
        materialInfo.field = item.AttributeFieldName;
        materialInfo.value = item.AttributeValueName;

        materialInfos.push(materialInfo);
      }
    }
  }
  return materialInfos;
}

// Get Map of material items where the key is the header and the values are the values
export function Server_GetMaterialHeaders(data: any): Map<string, string> {

  // Find the index for material info
  var itemType: string;
  var properties = Object.getOwnPropertyNames(data);

  for (var i in properties) {

    var name = properties[i];
    for (let item of data[name]) {

      if (item.hasOwnProperty('Material')) {

        itemType = name;
        break;
      }
    }
  }

  var items: any = data[itemType];
  var Material: Map<string, string> = new Map<string, string>();

  if (items) {
    for (let item of items[0].Material) {

      if (item !== null) {

        Material.set(item.AttributeFieldName, item.AttributeValueName);
      }
    }
  }
  return Material;
}

// Get Map of material items where the key is the header and the values are the values
export function Server_GetMaterialFields(items: any): Map<string, string> {

  var Material: Map<string, string> = new Map<string, string>();

  if (items) {
    for (var item of items.Material) {

      if (item !== null) {

        Material.set(item.AttributeFieldName, item.AttributeValueName);
      }
    }
  }
  return Material;
}

// Convert the JSON object structure to the internal Material structure
export function Server_ConvertToMaterial(items: any): Material[] {

    var materials: Material[] = [];
    if (items && items.hasOwnProperty('Batches')) {
        for (var item of items.Batches) {
          var material = new Material();

            material.uid = item.Uid;
            material.name = item.Name;

            var it: number = 0;
             
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

// Convert the JSON object structure to the internal Material structure
export function Server_ConvertToSingleMaterial(item: any): Material {

    var material = new Material();

    material.uid = item.Uid;
    material.name = item.Name;
    
    var it: number = 0;

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

export class JSON_Batch {

  public Uid: string;
  public Name: string;
  public DateTime: string;
    public SampleQty: number;
    public CryoSeedQty: number;
    public TestedSeedQty: number;
    public SDSeedQty: number;
  public Material: any;
  public Notes: string;
}

// Convert the JSON object structure to the internal extended Material structure
export function Server_ConvertToMaterialExtended(item: any): MaterialBatch {

  let material: MaterialBatch = new MaterialBatch();
  
  if (item) {
      material.uid = item.Uid;
      material.name = item.Name;
      material.date = item.Date;

      if (item.hasOwnProperty('Material')) {

        material.materialInfo = [];
        for (let info of item.Material) {

          let mInfo = new MaterialInfo();
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

// Convert the JSON object structure to the internal extended Material structure
export function Server_ConvertManyToMaterialExtended(items: any): MaterialBatch[] {

  let materials: MaterialBatch[] = [];

  if (items && items.hasOwnProperty('Batches')) {
    for (let item of items.Batches) {
      let material = new MaterialBatch();
      if (item) {
        material.uid = item.Uid;
        material.name = item.Name;
        material.date = item.Date;

        if (item.hasOwnProperty('Material')) {

          material.materialInfo = [];
          for (let info of item.Material) {

            let mInfo = new MaterialInfo();
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

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromMaterialExtended(material: MaterialBatch): any {

    let batch = new JSON_Batch();
    if (material) {

      batch.Uid = material.uid;
      batch.Name = material.name;
      batch.Material = [];
      if (material.hasOwnProperty('materialInfo')) {

        batch.Material = [];
        for (let info of material.materialInfo) {

          let mInfo = {
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

// TODO FIX THIS FUDGE!
export function Server_ConvertToPrimaryContainer(item): any
{
  return item;
}

// Convert the JSON object structure to the internal Batch structure
export function Server_ConvertToBatch(items: any): Batch[] {

    var batches: Batch[] = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        if (items) {
            for (var item of items.Aliquots) {

                var aliquot = new Batch();

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

// Convert the JSON object structure to the internal Pick List structure
export function Server_ConvertToPicklist(items: any): PickListItem[] {

    var picklist: PickListItem[] = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        for (var item of items.Aliquots) {
            var picklistItem = new PickListItem();
            var it: number = 0;
            picklistItem.uid = item.Uid;
            picklistItem.batchName = item.BatchName; 
            picklistItem.primary_description = item.PrimaryDescription; 
            picklistItem.accessionNo = item.Material[1].AttributeValueName;
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

// Convert the JSON object structure to the internal material type structure
export function Server_ConvertToMaterialType(items: any): string[] {

    var types: string[] = [];
    if (items) {
        for (var item of items) {
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

export class JSON_contentsList {
    public uid: string;
    public attribute_field: string;
    public AttributeValueName: string;
    public BatchName: string;
    public Sample_Type: string;
    public primary_description: string;
    public parent_description: string;
    public gParent_description: string;
    public ggParent_description: string;
    public site: string;
}

export function Server_ConvertToContents(items: any): Contents[] {

    var contents: Contents[] = [];
    if (items && items.hasOwnProperty('Aliquots')) {
        if (items) {            
            for (var item of items.Aliquots) {

                var contentsItem = new Contents();

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

export class JSON_ordersList {
    public Uid: number;
    public ConsignmentNo: string;
    public Sender: string;
    public Recipient: string;
    public SampleQty: number;
    public Status: string;
}

export class JSON_ordersExt {
    public Uid: number;
    public ConsignmentNo: string;
    public Sender: string;
    public Recipient: string;
    public OrderedDate: Date;
    public DispatchedDate: Date;
    public ArrivedDate: Date;
    public SampleQty: number;
    public Status: string;
    public Notes: string;
}

// Convert the JSON object structure to the internal extended Order structure
export function Server_ConvertToOrder(items: any): Order[] {

    var orders: Order[] = [];
    if (items && items.hasOwnProperty('Orders')) {
        if (items) {
            
            for (var item of items.Orders) {
                var orderItem = new Order();

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

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromOrder(order: Order): JSON_ordersList {

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

// Convert the JSON object structure to the internal Order structure
export function Server_ConvertToSingleOrder(item: any): Order {

    var orderItem = new Order();

    orderItem.uid = item.Uid;
    orderItem.consignment_no = item.ConsignmentNo;
    orderItem.sender = item.Sender;
    orderItem.recipient = item.Recipient;
    orderItem.sample_qty = item.SampleQty;
    orderItem.status = item.Status;

    return orderItem;
}

// Converts from the RESTful API JSON structure to the internal object structure
export function Server_ConvertFromOrderExtended(order: Order): JSON_ordersExt {

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

// Convert the JSON object structure to the internal extended Order structure
export function Server_ConvertToOrderExtended(item: any): Order {

    var order: Order = new Order();
    if (item) {
        order.uid = item.Uid;//item.UID.toString();
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

export class JSON_Inventory {

    public Antenna: number;
    public UID: string[];
}

// Response from reader getInventory command
export function convertToInventory(items: any[]): Inventory[] {

    var inventory: Inventory[] = [];
  //  var item: JSON_Inventory;

    if (items) {
      for (var item of items) {
        
          var antennaInv = new Inventory();

          // Set the antenna number
          antennaInv.antenna = item.Antenna;

          antennaInv.UID = [];
          // Set each tag found on the antenna
        if (item.hasOwnProperty("UID")) {
          for (var uid of item.UID) {

            antennaInv.UID.push(uid);
          }
        }
        inventory.push(antennaInv);
      }
    }
    return inventory;
}

export class JSON_MaterialInfo {

  public AttributeFieldName: string;
  public AttributeValueName: string;
}

export class JSON_RFID {

  public Uid: string;
  public Position: number;
  public Description: string;
  public ContainerType: string;
  public BatchName: string;
  public Material: JSON_MaterialInfo;        
  public ParentUidDescription: Map<string, string>;
}

export function Server_ConvertToTagIdentity(item: any): TagIdentity {

  var tagIdentity = new TagIdentity();
  if (item) {

    tagIdentity.uid = item.Uid;
    tagIdentity.position = item.Position;
    tagIdentity.description = item.Description;
    tagIdentity.containerType = item.ContainerType;
    tagIdentity.batchName = item.BatchName;

    if (item.hasOwnProperty("ParentUidDescription")) {

      tagIdentity.parentUidDescription = new Map<string, string>();

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



export function Server_ConvertInventoryToTagIdentity(item: any): TagIdentity {

    var tagIdentity = new TagIdentity();
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

export function Server_ConvertToContainerStatus(items: JSON_RFID[], status: string): ContainerStatus[] {

    var containerStatuses: ContainerStatus[] = [];

    if (items) {

        for (var item of items) {

            var containerStatus = new ContainerStatus();
            containerStatus.containerUid = item.Uid;
            containerStatus.status = status;

            containerStatuses.push(containerStatus);
        }
    }

    return containerStatuses;
}

export function Server_GetCrops(item: Material[]): string[] {

    var unique = item.map(item => item.configurableField_1)
        .filter((value, index, self) => self.indexOf(value) === index)

   return unique;
}
