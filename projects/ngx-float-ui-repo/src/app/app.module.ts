import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
//
import {NgxFloatUiModule, NgxFloatUiPlacements, NgxFloatUiTriggers} from "ngx-float-ui";
//
import {NgxFloatUiAppComponent} from "./app.component";
import {NgxFloatUiDemoComponent} from "./components/demo/demo.component";
import {NgxFloatUiTestComponent} from "./components/test/test.component";

@NgModule({
    declarations: [NgxFloatUiAppComponent],
    imports: [
        BrowserModule,
        NgxFloatUiModule.forRoot({
            trigger: NgxFloatUiTriggers.click,
            hideOnClickOutside: false,
            placement: NgxFloatUiPlacements.BOTTOM
        }),
        NgxFloatUiDemoComponent,
        NgxFloatUiTestComponent
    ],
    providers: [],
    bootstrap: [NgxFloatUiAppComponent]
})
export class NgxFloatUiAppModule {
}
