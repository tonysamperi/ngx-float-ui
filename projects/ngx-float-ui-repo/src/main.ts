import {enableProdMode, provideZoneChangeDetection} from "@angular/core";

import {NgxFloatUiAppModule} from "./app/app.module";
import {NGX_FLOAT_UI_ENVIRONMENT} from "./environments/environment";
import {platformBrowser} from "@angular/platform-browser";

if (NGX_FLOAT_UI_ENVIRONMENT.production) {
    enableProdMode();
}

platformBrowser().bootstrapModule(NgxFloatUiAppModule, { applicationProviders: [provideZoneChangeDetection()], })
    .catch(err => console.error(err));
