"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LimitToValueConverter = /** @class */ (function () {
    function LimitToValueConverter() {
    }
    LimitToValueConverter.prototype.toView = function (array, count) {
        return array.slice(0, count);
    };
    return LimitToValueConverter;
}());
exports.LimitToValueConverter = LimitToValueConverter;
//# sourceMappingURL=limit-to-value-converter.js.map