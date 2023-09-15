"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var resources_1 = require("../../resources");
// Represents the locations in a box of vials
var LocationMap = /** @class */ (function () {
    function LocationMap() {
    }
    LocationMap.prototype.bind = function () {
        this.rows = [];
        var positions = [];
        // Build up the positions array
        for (var _i = 0, _a = this.vials; _i < _a.length; _i++) {
            var vial = _a[_i];
            if (vial.position) {
                positions.push(vial.position);
            }
        }
        // Sort the array first, ascending numbers
        positions.sort(function (a, b) { return a - b; });
        // Build up the rows array based on the positions occupied
        var i = 0;
        while (i < 10) {
            var row = [];
            var j = 0;
            while (j < resources_1.Resources.boxRowCount) {
                var item = positions.indexOf((i * resources_1.Resources.boxColumnCount + j + 1)) >= 0;
                row.push(item);
                j++;
            }
            this.rows.push(row);
            i++;
        }
    };
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], LocationMap.prototype, "rows", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], LocationMap.prototype, "vials", void 0);
    LocationMap = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], LocationMap);
    return LocationMap;
}());
exports.LocationMap = LocationMap;
//# sourceMappingURL=location-map.js.map