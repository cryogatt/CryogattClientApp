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
// Generic features of a material record for table
var Material = /** @class */ (function () {
    function Material() {
    }
    // Input validation for the form
    Material.prototype.validate = function () {
        // TODO JMJ Perform any input validation here
        return Promise.resolve();
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], Material.prototype, "uid", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "configurableField_1", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "configurableField_2", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "configurableField_3", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "configurableField_4", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], Material.prototype, "notes", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Material.prototype, "cryoSeedQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Material.prototype, "testedSeedQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], Material.prototype, "sDSeedQty", void 0);
    Material = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], Material);
    return Material;
}());
exports.Material = Material;
// Generic features of a batch 
var MaterialBatch = /** @class */ (function () {
    function MaterialBatch() {
    }
    // Input validation for the form
    MaterialBatch.prototype.validate = function () {
        // Check name has been entered and is a suitable length
        if (!this.name) {
            return Promise.reject('Batch ID required!');
        }
        else if (this.name.length > 50) {
            return Promise.reject('Batch ID must be no longer than 50 characters!');
        }
        else if (this.name.indexOf('$') !== -1) {
            return Promise.reject('Batch ID cannot contain character: $');
        }
        // Check info does not contain $ as this data is exported to excel 
        for (var _i = 0, _a = this.materialInfo; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.value && info.value.indexOf('$') !== -1) {
                return Promise.reject(info.field + ' cannot contain character: $');
            }
        }
        return Promise.resolve();
    };
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], MaterialBatch.prototype, "uid", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], MaterialBatch.prototype, "name", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], MaterialBatch.prototype, "date", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], MaterialBatch.prototype, "sampleQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Array)
    ], MaterialBatch.prototype, "materialInfo", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], MaterialBatch.prototype, "notes", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], MaterialBatch.prototype, "cryoSeedQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], MaterialBatch.prototype, "testedSeedQty", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", Number)
    ], MaterialBatch.prototype, "sDSeedQty", void 0);
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Array)
    ], MaterialBatch.prototype, "cropList", void 0);
    MaterialBatch = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], MaterialBatch);
    return MaterialBatch;
}());
exports.MaterialBatch = MaterialBatch;
// Generic features of a material record for table
var MaterialInfo = /** @class */ (function () {
    function MaterialInfo() {
    }
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], MaterialInfo.prototype, "field", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
        __metadata("design:type", String)
    ], MaterialInfo.prototype, "value", void 0);
    MaterialInfo = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.autoinject()
    ], MaterialInfo);
    return MaterialInfo;
}());
exports.MaterialInfo = MaterialInfo;
//# sourceMappingURL=material.js.map