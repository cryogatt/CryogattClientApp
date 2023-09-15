"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var NumericValueConverter = /** @class */ (function () {
    function NumericValueConverter() {
    }
    NumericValueConverter.prototype.toView = function (value) {
        if (value === undefined) {
            return 'undefined';
        }
        if (value === null) {
            return 'null';
        }
        if (isNumeric(value)) {
            return value.toString(10);
        }
        return '"${value}"';
    };
    return NumericValueConverter;
}());
exports.NumericValueConverter = NumericValueConverter;
//# sourceMappingURL=numeric-value-converter.js.map