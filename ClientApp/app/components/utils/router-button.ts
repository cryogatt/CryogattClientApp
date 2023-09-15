import { transient, bindable, autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@transient()
@autoinject()
export class RouterButton {

    public element: Element;
    public router: Router;

    // Routing properties
    @bindable route: string;
    @bindable params: string;

    // Button properties
    @bindable title: string;
    @bindable enabled: boolean;

    constructor(element: Element, router: Router) {
        this.element = element;
        this.router = router;
    }

    navigate() {
        // Navigate to this path
        this.router.navigateToRoute(this.route, { item: this.params });
    }

}