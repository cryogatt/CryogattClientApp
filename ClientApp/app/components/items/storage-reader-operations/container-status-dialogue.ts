import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-dependency-injection';
import Server = require("../../api/server");
import { Slot } from '../../reader/data-structures/slot';
import { SlotStates } from '../../reader/data-structures/slot-states';
import { Http_GetSingleTagIdentity } from '../../api/server';
import { Server_ConvertToTagIdentity, Server_ConvertToContainerStatus } from '../../api/json-map';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

@autoinject()
export class ContainerStatusDialogue {

    // Dialogue header
    public title: string = "Please Select Reason for Withdrawal";
    // Dialogue sub-header
    public subtitle: string;
    // Modal binding
    public controller: DialogController;

    public containers: any[];

    @bindable({ defaultBindingMode: bindingMode.twoWay }) reason: string;
    @bindable reasons: string[] = [ "Training", "Research", "Treatment", "Shipment back to Nottingham central" ];

    // Constructor
    constructor(dialogController: DialogController) {

        this.controller = dialogController;
    }

    public activate(containers: any[]) {

        this.containers = containers;        
    }

    public async save() {

        var primaryContainers = this.fliterNonPrimaryContainers(this.containers);

        var status = "Withdrawn for " + this.reason;

        var containerStatuses = Server_ConvertToContainerStatus(primaryContainers, status);

        await Server.Http_PostContainerStatuses(containerStatuses)
            .then(data => {

                this.controller.close(true);
            }).catch(error => {

                this.controller.close(false);
            });
    }

    private fliterNonPrimaryContainers(items: any): any[] {

        return items.filter(
            item => item.ContainerType == "Vial" || item.ContainerType == "Straw");
    }
}