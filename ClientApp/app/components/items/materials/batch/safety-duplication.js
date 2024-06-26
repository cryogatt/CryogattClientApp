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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var json_map_1 = require("../../../api/json-map");
var generic_storage_1 = require("../../generic-storage");
var materials_1 = require("../materials");
var SafetyDuplication = /** @class */ (function () {
    // Constructor
    function SafetyDuplication(storage, materials) {
        this.storage = storage;
        this.materials = materials;
    }
    // Sets up the specific bindings for Materials
    SafetyDuplication.prototype.activate = function (routeParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // General properties
                this.storage.storageType = 'material';
                this.storage.type_singular = " ";
                this.storage.type_plural = this.storage.type_singular;
                this.storage.title = "Safety Duplication";
                this.storage.subtitle = "";
                this.storage.apiPath = "aliquots";
                // Set up the table schema
                this.storage.schema = new Map();
                this.storage.schema.set("UID", "UID");
                this.storage.schema.set("primary_description", "Description"); // TODO - Change here
                // ToDo Add primary description
                //        this.storage.schema.set("Status", "Status");
                this.storage.schema.set("parent_description", "Stored In");
                this.storage.schema.set("gParent_description", "Stack");
                this.storage.schema.set("ggParent_description", "Dewar");
                this.storage.schema.set("site", "Site");
                // Command presence
                this.storage.canViewHistory = true;
                this.storage.canAddToPickList = true;
                this.storage.canUpdatePickList = true;
                // Fetch the data using the Web API
                this.storage.fetch(this.setPath(routeParams), json_map_1.Server_ConvertToBatch);
                return [2 /*return*/];
            });
        });
    };
    SafetyDuplication.prototype.setPath = function (routeParams) {
        return this.storage.apiPath + "/" + routeParams.item + "?BATCH_TYPE=" + "Safety Duplication";
    };
    SafetyDuplication = __decorate([
        aurelia_framework_1.transient(),
        aurelia_framework_1.useView('../../generic-storage.html'),
        aurelia_framework_1.inject(generic_storage_1.GenericStorage, materials_1.Materials),
        __metadata("design:paramtypes", [generic_storage_1.GenericStorage, materials_1.Materials])
    ], SafetyDuplication);
    return SafetyDuplication;
}());
exports.SafetyDuplication = SafetyDuplication;
//# sourceMappingURL=safety-duplication.js.map