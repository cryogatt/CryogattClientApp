function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export class NumericValueConverter {
    toView(value) {
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
    }
}