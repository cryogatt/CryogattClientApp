import { transient, inject, bindable, bindingMode } from 'aurelia-framework';
import { Http_GetMaterial } from '.././api/server';
import { Http_GetItems } from '.././api/server';
import { Server_ConvertToMaterial } from '.././api/json-map';
import Jsonmap = require(".././api/json-map");
import { MaterialBatch } from '../items/materials/material';
import { GenericStorageItem } from '../items/generic-storage-item';
import Material = require('../items/materials/material');
import MaterialInfo = Material.MaterialInfo;
import { GenericStorage } from '../items/generic-storage'

var $ = require('jquery');
import 'bootstrap-daterangepicker';
import * as moment from 'moment';
import * as toastr from 'toastr';
@transient()
@inject(Element)

export class DateRangePicker {

    public element: Element;
    public materialInfos: MaterialInfo[];
    // Date field bindings
    @bindable({ defaultBindingMode: bindingMode.twoWay }) dateRange: string;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) enabled: boolean;
    
    public cropList: string[];
    constructor(element) {
        this.element = element;
    }

    attached() {

        var startDate = moment();
        var endDate = moment();

        function changeCallback(start, end) {
            $(".date-range").val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
            $(".date-range-picker").trigger('drp:change');
        }

        $(this.element).daterangepicker({
            "ranges": {
                "All": [moment('01/01/1900', 'DD/MM/YYYY'), moment().endOf('month')],
                "Today": [ moment(), moment() ],
                "Yesterday": [ moment().subtract(1, 'days'), moment().subtract(1, 'days') ],
                "Last 7 Days": [ moment().subtract(6, 'days'), moment() ],
                "Last 30 Days": [ moment().subtract(29, 'days'), moment() ],
                "This Month": [ moment().startOf('month'), moment().endOf('month') ],
                "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            "showCustomRangeLabel": true,
            "startDate": startDate,
            "endDate": endDate,
            "buttonClasses": "btn btn-primary",
            locale: {
                format: 'DD/MM/YYYY'
            }
        }, changeCallback);

        $(".date-range-picker").on('drp:change', e => {
            this.dateRange = $(".date-range").val();
        });

        changeCallback(startDate, endDate);
    }

    detached() {
        $(this.element).daterangepicker('destroy');
    }
}

