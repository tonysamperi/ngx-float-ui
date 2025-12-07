import {Component, ViewEncapsulation} from "@angular/core";
//
import {NGX_FLOAT_UI_ENVIRONMENT} from "../environments/environment";
import {NgxFloatUiDemoComponent} from "./components/demo/demo.component";
import {NgxFloatUiTestComponent} from "./components/test/test.component";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgxFloatUiTestComponent,
        NgxFloatUiDemoComponent
    ]
})
export class NgxFloatUiAppComponent {

    isDemo: boolean = NGX_FLOAT_UI_ENVIRONMENT.isDemo;

}
