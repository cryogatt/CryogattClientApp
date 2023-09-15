"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeysValueConverter = /** @class */ (function () {
    function KeysValueConverter() {
    }
    KeysValueConverter.prototype.toView = function (value) {
        return Object.keys(value);
    };
    return KeysValueConverter;
}());
exports.KeysValueConverter = KeysValueConverter;
//# sourceMappingURL=keys-value-converter.js.map