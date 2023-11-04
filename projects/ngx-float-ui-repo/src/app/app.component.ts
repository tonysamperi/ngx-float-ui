import {Component, ViewEncapsulation} from "@angular/core";
//
import {NGX_FLOAT_UI_ENVIRONMENT} from "../environments/environment";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class NgxFloatUiAppComponent {

    isDemo: boolean = NGX_FLOAT_UI_ENVIRONMENT.isDemo;

}
