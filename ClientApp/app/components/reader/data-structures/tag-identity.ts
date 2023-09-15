// Response from database regarding a single tag's identity

export class TagIdentity {

    public uid: string;
    public description: string;
    public containerType: string;
    public batchName: string;
    public tagIdent: number;
    public batchId: string;
    //public material: MaterialInfo[];
    public position: number;
    public parentUidDescription: Map<string, string>;
}

//export class MaterialInfo {

//  public field: string;
//  public value: string;
//}