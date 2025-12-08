import {ApplicationConfig, enableProdMode, provideZoneChangeDetection} from "@angular/core";
import {bootstrapApplication} from "@angular/platform-browser";
import {NgxFloatUiPlacements, NgxFloatUiTriggers} from "ngx-float-ui";
import {provideNgxFloatUiOptions} from "../../ngx-float-ui/src/lib/providers/provide-ngx-float-ui-options.provider";
//
import {NgxFloatUiAppComponent} from "./app/app.component";
import {NGX_FLOAT_UI_ENVIRONMENT} from "./environments/environment";

if (NGX_FLOAT_UI_ENVIRONMENT.production) {
    enableProdMode();
}

const appConfig: ApplicationConfig = {
    providers: [
        provideNgxFloatUiOptions({
            trigger: NgxFloatUiTriggers.click,
            hideOnClickOutside: false,
            placement: NgxFloatUiPlacements.BOTTOM
        })
    ]
};

bootstrapApplication(NgxFloatUiAppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]})
    .catch((err) => console.error(err));
