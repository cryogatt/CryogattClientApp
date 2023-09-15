"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var StorageModalMode;
(function (StorageModalMode) {
    StorageModalMode[StorageModalMode["CREATE"] = 1] = "CREATE";
    StorageModalMode[StorageModalMode["EDIT"] = 2] = "EDIT";
    StorageModalMode[StorageModalMode["VIEW"] = 3] = "VIEW";
})(StorageModalMode = exports.StorageModalMode || (exports.StorageModalMode = {}));
// See this link for a useful example: http://www.foursails.co/blog/template-constants/
var StorageModalModeBinder = /** @class */ (function () {
    function StorageModalModeBinder() {
    }
    StorageModalModeBinder.prototype.beforeBind = function (view) {
        // Make the enumerated type available
        view.overrideContext['StorageModalMode'] = StorageModalMode;
        // TypeScript enums are not iterable by default; thus, make it iterable (may be useful)
        view.overrideContext['StorageModalModes'] =
            Object.keys(StorageModalMode)
                .filter(function (key) { return typeof StorageModalMode[key] === 'number'; });
    };
    StorageModalModeBinder = __decorate([
        aurelia_framework_1.viewEngineHooks()
    ], StorageModalModeBinder);
    return StorageModalModeBinder;
}());
exports.StorageModalModeBinder = StorageModalModeBinder;
//# sourceMappingURL=storage-modal-mode.js.map