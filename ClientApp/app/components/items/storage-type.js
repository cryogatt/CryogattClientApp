"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var StorageType;
(function (StorageType) {
    StorageType[StorageType["MATERIAL"] = 1] = "MATERIAL";
    StorageType[StorageType["CONTAINER"] = 2] = "CONTAINER";
    StorageType[StorageType["USER"] = 3] = "USER";
    StorageType[StorageType["ORDER"] = 4] = "ORDER";
    StorageType[StorageType["CONTENTS"] = 5] = "CONTENTS";
    StorageType[StorageType["ASSIGN_ALIQUOT"] = 6] = "ASSIGN_ALIQUOT";
    StorageType[StorageType["ASSIGN_CONTAINER"] = 7] = "ASSIGN_CONTAINER";
})(StorageType = exports.StorageType || (exports.StorageType = {}));
// See this link for a useful example: http://www.foursails.co/blog/template-constants/
var StorageTypeBinder = /** @class */ (function () {
    function StorageTypeBinder() {
    }
    StorageTypeBinder.prototype.beforeBind = function (view) {
        // Make the enumerated type available
        view.overrideContext['StorageType'] = StorageType;
        // TypeScript enums are not iterable by default; thus, make it iterable (may be useful)
        view.overrideContext['StorageTypes'] =
            Object.keys(StorageType)
                .filter(function (key) { return typeof StorageType[key] === 'number'; });
    };
    StorageTypeBinder = __decorate([
        aurelia_framework_1.viewEngineHooks()
    ], StorageTypeBinder);
    return StorageTypeBinder;
}());
exports.StorageTypeBinder = StorageTypeBinder;
//# sourceMappingURL=storage-type.js.map