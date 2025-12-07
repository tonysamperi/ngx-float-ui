import {Provider} from "@angular/core";
//
import {NgxFloatUiOptions} from "../models/ngx-float-ui-options.model";
import {NGX_FLOAT_UI_DEFAULTS} from "../models/ngx-float-ui-defaults.model";

export function provideNgxFloatUiOptions(config: NgxFloatUiOptions = {}): Provider[] {
    return [
        {provide: NGX_FLOAT_UI_DEFAULTS, useValue: config},
    ];
}
