import { bindable } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";

// Record of a general types of Container Ident - e.g Racks, Dewars, Pots, etc.
export class GeneralType {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) ident: number;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) description: string;
}

export class Subtype {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) tagIdent: number;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) description: string; 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) isRfidEnabled: boolean;
}