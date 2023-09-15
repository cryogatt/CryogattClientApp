import { transient, bindable, autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@transient()
@autoinject()
export class RecursiveRouterButton {

    public element: Element;
    public router: Router;

    // Routing properties
    @bindable route: string;
    private params: string;
    @bindable id: number;
    @bindable path: string;
    @bindable name: string;

    // Button properties
    @bindable title: string;
    @bindable enabled: boolean;

    constructor(element: Element, router: Router) {
        this.element = element;
        this.router = router;
    }

    navigate() {
        // Navigate to this path
        this.params = encodeURIComponent(this.path + "%0B" + String(this.id) + "%0B" + this.name);
        this.router.navigateToRoute(this.route, { item: this.params });
    }

}