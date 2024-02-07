import {Component} from "@angular/core";
//
import {NgxFloatUiContentComponent, NgxFloatUiDirective, NgxFloatUiPlacements} from "ngx-float-ui";

@Component({
    selector: "app-test",
    templateUrl: "test.component.html",
    styleUrls: ["test.component.scss"],
    standalone: true,
    imports: [NgxFloatUiContentComponent, NgxFloatUiDirective]
})
export class NgxFloatUiTestComponent {

    popperPlacements: typeof NgxFloatUiPlacements = NgxFloatUiPlacements;
    year: number = new Date().getFullYear();

}
