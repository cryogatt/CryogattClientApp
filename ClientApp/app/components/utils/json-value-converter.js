"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonValueConverter = /** @class */ (function () {
    function JsonValueConverter() {
    }
    // Used for debugging .html
    JsonValueConverter.prototype.toView = function (obj) {
        if (obj) {
            return JSON.stringify(obj, null, 2);
        }
    };
    return JsonValueConverter;
}());
exports.JsonValueConverter = JsonValueConverter;
//# sourceMappingURL=json-value-converter.js.map