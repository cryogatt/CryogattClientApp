import { customAttribute, bindingMode, DOM, inject } from 'aurelia-framework';
import * as toastr from 'toastr';

function getNumber(value) {
  var number = parseFloat(value);
  return !isNaN(number) && isFinite(value) ? number : NaN;
}

@customAttribute('numeric-value', bindingMode.twoWay)
@inject(DOM.Element)
export class NumericValue {

    // Element which has the custom attribute
    element;

    // Value bound to the attribute
    value;

    constructor(element) {
        this.element = element;
    }

    valueChanged() {

        // Synchronize the input element with the bound value
        var number = getNumber(this.value);
        if (isNaN(number)) {
            this.element.value = "";
        }
        else {
            // Convert to a decimal number
            this.element.value = number.toString(10);
        }
    }
  
    blur = () => {

        // Blank input maps to a null value
        if (this.element.value === "") {
            this.value = null;
            return;
        }

        // Check for a valid number
        var number = getNumber(this.element.value);
        if (isNaN(number)) {

            // Reset the input value
            this.valueChanged();
        }
        else {
            this.value = number;
        }
    }

    // Add event handler
    bind() {
        this.valueChanged();
        this.element.addEventListener('blur', this.blur);
    }

    // Remove event handler
    unbind() {
        this.element.removeEventListener('blur', this.blur);
    }
}