import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
//
import {NgxFloatUiDirective} from "./directives/ngx-float-ui/ngx-float-ui.directive";
import {NgxFloatUiLooseDirective} from "./directives/ngx-float-ui/ngx-float-ui-loose.directive";
import {NgxFloatUiContentComponent} from "./components/ngx-float-ui-content/ngx-float-ui-content.component";
import {NgxFloatUiOptions} from "./models/ngx-float-ui-options.model";
import {provideNgxFloatUiOptions} from "./providers/provide-ngx-float-ui-options.provider";


@NgModule({
    imports: [
        CommonModule,
        NgxFloatUiContentComponent,
        NgxFloatUiDirective,
        NgxFloatUiLooseDirective
    ],
    exports: [
        NgxFloatUiContentComponent,
        NgxFloatUiDirective,
        NgxFloatUiLooseDirective
    ],
    providers: [
        provideNgxFloatUiOptions()
    ]
})
export class NgxFloatUiModule {

    public static forRoot(popperBaseOptions?: NgxFloatUiOptions): ModuleWithProviders<NgxFloatUiModule> {
        return {
            ngModule: NgxFloatUiModule,
            providers: [
                provideNgxFloatUiOptions(popperBaseOptions)
            ]
        };
    }
}
