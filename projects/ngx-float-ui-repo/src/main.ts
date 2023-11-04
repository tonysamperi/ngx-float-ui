import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {NgxFloatUiAppModule} from "./app/app.module";
import {NGX_FLOAT_UI_ENVIRONMENT} from "./environments/environment";

if (NGX_FLOAT_UI_ENVIRONMENT.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(NgxFloatUiAppModule)
    .catch(err => console.error(err));
