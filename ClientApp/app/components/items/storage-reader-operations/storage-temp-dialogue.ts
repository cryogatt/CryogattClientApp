import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-dependency-injection';
import Server = require("../../api/server");
import { Slot } from '../../reader/data-structures/slot';
import { SlotStates } from '../../reader/data-structures/slot-states';
import { Http_GetSingleTagIdentity } from '../../api/server';
import { Server_ConvertToTagIdentity } from '../../api/json-map';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { Reader_GetTemp } from '../../api/reader';
import { ReaderType } from '../../reader/reader-types';

@autoinject()
export class StorageTempDialogue {

  // Dialogue header
  public title: string = 'Internal Temperature Readings';
  // Dialogue sub-header
  public subtitle: string;
  // Modal binding
  public controller: DialogController;

  // Slot binding
  @bindable({ defaultBindingMode: bindingMode.twoWay }) temperatureStats: any[];

  // Constructor
  constructor(dialogController: DialogController) {

    this.controller = dialogController;
  }
  
    public async activate(/*model: ReaderType*/) {

        var temps = await Reader_GetTemp(ReaderType.CRYOGATT_R10102);

        this.temperatureStats = temps;
  }
}