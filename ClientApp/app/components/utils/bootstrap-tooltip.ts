import { transient, customAttribute, inject, bindable } from 'aurelia-framework';
var $ = require('jquery');
import 'bootstrap';

@transient()
@customAttribute('bootstrap-tooltip')
@inject(Element)
export class BootstrapTooltip {

    element: Element;
    @bindable title: string;

    constructor(element) {
        this.element = element;
    }

    bind() {
        $(this.element).tooltip({ title: this.title })
    }

    unbind() {
        $(this.element).tooltip('destroy');
    }

    titleChanged() {
        $(this.element).data('bs.tooltip', false)
        $(this.element).tooltip({ title: this.title });
    }
}