import * as moment from 'moment';

export class formatValueConverter {
    toView(value, format) {

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
    }
}