import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Inject,
    Input,
    ViewContainerRef
} from "@angular/core";
//
import {NgxFloatUiOptions} from "../../models/ngx-float-ui-options.model";
import {NgxFloatUiPlacements} from "../../models/ngx-float-ui-placements.model";
import {NGX_FLOAT_UI_DEFAULTS} from "../../models/ngx-float-ui-defaults.model";
import {NgxFloatUiDirective} from "./ngx-float-ui.directive";
import {NgxFloatUiContentComponent} from "../../components/ngx-float-ui-content/ngx-float-ui-content.component";
import {NgxFloatUiTriggers} from "../../models/ngx-float-ui-triggers.model";

@Directive({
    selector: "[floatUiLoose]",
    exportAs: "floatUiLoose",
    standalone: true
})
export class NgxFloatUiLooseDirective extends NgxFloatUiDirective {

    @Input()
    set floatUiLoose(newValue: string | NgxFloatUiContentComponent) {
        this.floatUi = newValue;
    }

    @Input()
    set loosePlacement(newValue: `${NgxFloatUiPlacements}`) {
        this.placement = newValue as NgxFloatUiPlacements;
    }

    @Input()
    set looseTrigger(newValue: `${NgxFloatUiTriggers}`) {
        this.showTrigger = newValue as NgxFloatUiTriggers;
    }

    constructor(changeDetectorRef: ChangeDetectorRef,
                elementRef: ElementRef,
                vcr: ViewContainerRef,
                @Inject(NGX_FLOAT_UI_DEFAULTS) popperDefaults: NgxFloatUiOptions = {}) {
        super(changeDetectorRef, elementRef, vcr, popperDefaults);
    }

}
