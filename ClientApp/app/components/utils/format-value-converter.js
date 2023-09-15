"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var formatValueConverter = /** @class */ (function () {
    function formatValueConverter() {
    }
    formatValueConverter.prototype.toView = function (value, format) {
        if (value instanceof Date) {
            // Handle the different date formats
            if (format === 'history') {
                return (value === null || value === undefined) ? "" : moment(value).format("DD/MM/YYYY, HH:mm:ss");
            }
            else {
                return (value === null || value === undefined) ? "" : moment(value).format("DD/MM/YYYY");
            }
        }
        else {
            return value;
        }
    };
    return formatValueConverter;
}());
exports.formatValueConverter = formatValueConverter;
//# sourceMappingURL=format-value-converter.js.map