import {NgClass, NgStyle} from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from "@angular/core";
//
import {
    Alignment,
    arrow,
    autoPlacement,
    autoUpdate,
    computePosition,
    ComputePositionConfig,
    flip,
    limitShift,
    offset,
    Middleware,
    Placement,
    shift
} from "@floating-ui/dom";
import {Subject} from "rxjs";
//
import {NgxFloatUiOptions} from "../../models/ngx-float-ui-options.model";
import {NgxFloatUiPlacements} from "../../models/ngx-float-ui-placements.model";
import {NgxFloatUiTriggers} from "../../models/ngx-float-ui-triggers.model";

@Component({
    selector: "float-ui-content",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./ngx-float-ui-content.component.html",
    styleUrls: ["./ngx-float-ui-content.component.scss"],
    exportAs: "ngxFloatUiContent",
    imports: [NgStyle, NgClass]
})
export class NgxFloatUiContentComponent implements OnDestroy {

    static nextId: number = 0;

    protected static readonly _DISPLAY_TYPES = ["none", "block"];

    protected static readonly _DYNAMIC_ARROW_SIDES = {
        top: "left",
        right: "top",
        bottom: "left",
        left: "top"
    };

    protected static readonly _SIDE_AXIS = {
        left: "x",
        top: "y",
        right: "x",
        bottom: "y"
    };

    protected static readonly _STATIC_ARROW_SIDES = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
    };

    get boundariesElement() {
        if (!this._boundariesElement) {
            this._boundariesElement = this.floatUiOptions.boundariesElement
                ? document.querySelector(this.floatUiOptions.boundariesElement) ?? void 0
                : this.referenceObject.parentElement ?? void 0;
        }

        return this._boundariesElement;
    }

    ariaHidden = "true";
    arrowColor: string | null = null;
    displayType = "none";
    elRef: ElementRef = inject(ElementRef);
    floatUiOptions: NgxFloatUiOptions = {
        disableAnimation: false,
        disableDefaultStyling: false,
        boundariesElement: "",
        trigger: NgxFloatUiTriggers.hover,
        positionFixed: false,
        appendToBody: false,
        popperModifiers: []
    } as NgxFloatUiOptions;
    floatUiSwitch: (() => void) | undefined;
    @ViewChild("floatUiViewRef", {static: !0}) floatUiViewRef!: ElementRef;
    id: string = `ngx_float_ui_${++NgxFloatUiContentComponent.nextId}`;
    isMouseOver: boolean = !1;
    onHidden = new EventEmitter<void>();
    onUpdate: (() => void) | undefined;
    opacity = 0;
    referenceObject!: HTMLElement;
    state = !1;
    text = "";

    protected _appendToElement: HTMLElement | undefined;
    protected _arrowElement: HTMLElement | undefined;
    protected _boundariesElement: HTMLElement | undefined;
    protected _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected _destroy$: Subject<void> = new Subject<void>();
    protected _destroyed = !1;
    protected _floatingOffset = 0;
    protected _styleId = `${this.id}_style`;
    protected _viewRef: ViewContainerRef = inject(ViewContainerRef);

    private _lastState!: boolean;

    constructor() {
        this._toggleVisibility(!1);
    }

    clean() {
        this.toggleVisibility(false);
        this.floatUiSwitch?.();
    }

    extractAppliedClassListExpr(classList: string | string[] = []): Record<string, boolean> {
        const klassList = Array.isArray(classList) ? classList : typeof classList === typeof "" ? classList.replace(/ /, "").split(",") : [];

        return klassList.reduce<Record<string, boolean>>((acc, klass) => {
            acc[klass] = !0;

            return acc;
        }, {});
    }

    hide(): void {
        if (this.floatUiSwitch) {
            this.floatUiSwitch();
        }
        this.toggleVisibility(!1);
        this.onHidden.emit();
    }

    ngOnDestroy() {
        this._destroyed = !0;
        this._destroy$.next();
        this._destroy$.complete();
        this.clean();
        if (this.floatUiOptions.appendTo && this.elRef && this.elRef.nativeElement && this.elRef.nativeElement.parentNode) {
            this._viewRef.detach();
            this.elRef.nativeElement.parentNode.removeChild(this.elRef.nativeElement);
        }
    }

    @HostListener("mouseover")
    onMouseOver() {
        this.isMouseOver = true;
    }

    show(): void {
        if (!this.referenceObject) {
            return;
        }
        this._refreshCachedElements();
        this._determineArrowColor();
        this.floatUiSwitch = autoUpdate(
            this.referenceObject,
            this.floatUiViewRef.nativeElement,
            () => {
                this._computePosition();
            }
        );
    }

    @HostListener("mouseleave")
    showOnLeave() {
        this.isMouseOver = false;
        if (this.floatUiOptions.trigger !== NgxFloatUiTriggers.hover && !this.floatUiOptions.hideOnMouseLeave) {
            return;
        }
        this.hide();
    }

    // Toggle visibility and detect changes - Run only after ngOnInit!
    toggleVisibility(state: boolean): void {
        if (state !== this._lastState) {
            this._lastState = state;
            this._toggleVisibility(state);
            if (!this._destroyed) {
                this._changeDetectorRef.detectChanges();
            }
        }
    }

    update(): void {
        this._computePosition();
    }

    protected _computePosition(): void {
        if (this._appendToElement) {
            const parent = this.elRef.nativeElement.parentNode;
            if (parent !== this._appendToElement) {
                parent?.removeChild(this.elRef.nativeElement);
                this._appendToElement.appendChild(this.elRef.nativeElement);
            }
        }
        const parsedAutoAlignment: Alignment | undefined = ((this.floatUiOptions.placement || "").replace("auto-", "") || void 0) as Alignment | undefined;
        // Since "auto" doesn't really exist in floating-ui we pass undefined to have auto
        const parsedPlacement = !this.floatUiOptions.placement || this.floatUiOptions.placement.indexOf(NgxFloatUiPlacements.AUTO) === 0
            ? void 0
            : (this.floatUiOptions.placement as Placement);
        const middleware: Middleware[] = [
            offset(this._floatingOffset || (this._floatingOffset = Math.sqrt(2 * this._arrowElement!.offsetWidth ** 2) / 2)),
            ...(this.floatUiOptions.preventOverflow
                    ? [flip()]
                    : []
            ),
            shift({
                limiter: limitShift(),
                crossAxis: !1,
                boundary: this.boundariesElement
            }),
            arrow({
                element: this._arrowElement!,
                padding: 4
            })
        ];
        // Since preventOverflow uses "flip" and "flip" can't be used with "autoPlacement" we get here only if both conditions are falsy
        if (!this.floatUiOptions.preventOverflow && !parsedPlacement) {
            middleware.push(
                autoPlacement({
                    crossAxis: !0,
                    alignment: parsedAutoAlignment,
                    autoAlignment: this.floatUiOptions.placement === NgxFloatUiPlacements.AUTO,
                    boundary: this.boundariesElement
                })
            );
        }
        computePosition(this.referenceObject, this.floatUiViewRef.nativeElement, {
            placement: parsedPlacement,
            strategy: this.floatUiOptions.positionFixed ? "fixed" : "absolute",
            middleware
        } satisfies ComputePositionConfig)
            .then(({middlewareData, x, y, placement}) => {
                const side = placement.split("-")[0] as keyof typeof NgxFloatUiContentComponent._STATIC_ARROW_SIDES;
                this.floatUiViewRef.nativeElement.setAttribute("data-float-ui-placement", side);
                if (middlewareData.arrow) {
                    const dynamicArrowSide = NgxFloatUiContentComponent._DYNAMIC_ARROW_SIDES[side] as keyof typeof NgxFloatUiContentComponent._SIDE_AXIS;
                    const dynamicSideAxis = NgxFloatUiContentComponent._SIDE_AXIS[dynamicArrowSide] as "x" | "y";
                    Object.assign(this._arrowElement!.style, {
                        top: "",
                        bottom: "",
                        left: "",
                        right: "",
                        [dynamicArrowSide]: middlewareData.arrow[dynamicSideAxis] != null ? `${middlewareData.arrow[dynamicSideAxis]}px` : "",
                        [NgxFloatUiContentComponent._STATIC_ARROW_SIDES[side]]: `${-this._arrowElement!.offsetWidth / 2}px`
                    });
                }
                Object.assign(this.floatUiViewRef.nativeElement.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
                this.toggleVisibility(!0);
                this.onUpdate?.();
            });
    }

    protected _createArrowSelector(): string {
        return `div#${this.id}.float-ui-container > .float-ui-arrow.ngxp__force-arrow`;
    }

    protected _determineArrowColor() {
        if (!this.floatUiOptions.styles || this.arrowColor) {

            return !1;
        }
        const ruleValue = this.floatUiOptions.styles["background-color"] || this.floatUiOptions.styles.backgroundColor;
        if (this.arrowColor === ruleValue) {
            return !1;
        }
        this.arrowColor = ruleValue;
        let $style = document.querySelector(`#${this._styleId}`) as HTMLStyleElement;
        const styleContent = this.arrowColor ?
            `${this._createArrowSelector()}:before { background-color: ${this.arrowColor}; }` : "";
        if (!$style) {
            $style = document.createElement("style") as HTMLStyleElement;
            $style.id = this._styleId;
            $style.setAttribute("type", "text/css");
            document.head.appendChild($style);
        }
        $style.textContent = styleContent;
    }

    protected _refreshCachedElements(): void {
        this._appendToElement = this.floatUiOptions.appendTo
            ? document.querySelector(this.floatUiOptions.appendTo) as HTMLElement | undefined
            : void 0;
        this._arrowElement = this.elRef.nativeElement.querySelector(".float-ui-arrow") as HTMLElement | undefined;
        this._floatingOffset = this._arrowElement
            ? Math.sqrt(2 * this._arrowElement.offsetWidth ** 2) / 2
            : 0;
    }

    protected _toggleVisibility(state: boolean): void {
        this.displayType = NgxFloatUiContentComponent._DISPLAY_TYPES[+state];
        this.opacity = +state;
        this.ariaHidden = `${!state}`;
        this.state = state;
        if (!state && this.floatUiViewRef) {
            Object.assign(this.floatUiViewRef.nativeElement.style, {
                transform: "",
                willChange: ""
            });
        }
    }
}

