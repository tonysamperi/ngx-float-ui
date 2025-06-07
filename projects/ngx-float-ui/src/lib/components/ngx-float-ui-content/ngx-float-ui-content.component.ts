import { NgClass, NgStyle } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
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
    Placement,
    shift,
} from "@floating-ui/dom";
import {fromEvent, Subject, takeUntil} from "rxjs";
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
    standalone: true,
    imports: [NgStyle, NgClass]
})
export class NgxFloatUiContentComponent implements OnDestroy {

    static nextId: number = 0;

    protected get _dynamicArrowSides() {
        return {
            top: "left",
            right: "top",
            bottom: "left",
            left: "top"
        };
    }

    protected get _sideAxis() {
        return {
            left: "x",
            top: "y",
            right: "x",
            bottom: "y"
        };
    }

    protected get _staticArrowSides() {
        return {
            top: "bottom",
            right: "left",
            bottom: "top",
            left: "right"
        };
    }

    ariaHidden: string;
    arrowColor: string | null = null;
    displayType: string;
    floatUiOptions: NgxFloatUiOptions = {
        disableAnimation: false,
        disableDefaultStyling: false,
        boundariesElement: "",
        trigger: NgxFloatUiTriggers.hover,
        positionFixed: false,
        appendToBody: false,
        popperModifiers: []
    } as NgxFloatUiOptions;
    floatUiSwitch: () => void;
    @ViewChild("floatUiViewRef", {static: !0}) floatUiViewRef: ElementRef;
    id: string = `ngx_float_ui_${++NgxFloatUiContentComponent.nextId}`;
    isMouseOver: boolean = !1;
    onHidden = new EventEmitter();
    onUpdate: () => any;
    opacity: number;
    referenceObject: HTMLElement;
    state: boolean;
    text: string;

    protected _destroy$: Subject<void> = new Subject<void>();
    protected _resizeCtrl$: Subject<void> = new Subject<void>();
    protected _styleId = `${this.id}_style`;

    constructor(public elRef: ElementRef,
                protected _viewRef: ViewContainerRef,
                protected _changeDetectorRef: ChangeDetectorRef) {
        this._toggleVisibility(!1);
    }

    clean() {
        this.toggleVisibility(false);
        if (!this.floatUiSwitch) {
            return;
        }
        this.floatUiSwitch();
    }

    extractAppliedClassListExpr(classList: string | string[] = []): object {
        const klassList = Array.isArray(classList) ? classList : typeof classList === typeof "" ? classList.replace(/ /, "").split(",") : [];

        return klassList.reduce((acc, klass) => {
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
        this._destroy$.next();
        this.clean();
        if (this.floatUiOptions.appendTo && this.elRef && this.elRef.nativeElement && this.elRef.nativeElement.parentNode) {
            this._viewRef.detach();
            this.elRef.nativeElement.parentNode.removeChild(this.elRef.nativeElement);
        }
    }

    onDocumentResize() {
        this.update();
    }

    @HostListener("mouseover")
    onMouseOver() {
        this.isMouseOver = true;
    }

    show(): void {
        if (!this.referenceObject) {
            return;
        }
        this._resizeCtrl$.next();
        this._determineArrowColor();
        this.floatUiSwitch = autoUpdate(
            this.referenceObject,
            this.floatUiViewRef.nativeElement,
            () => {
                this._computePosition();
            }
        );
        fromEvent(document, "resize")
            .pipe(
                takeUntil(this._resizeCtrl$),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: () => this.onDocumentResize()
            });
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
        this._toggleVisibility(state);
        // tslint:disable-next-line:no-string-literal
        if (!this._changeDetectorRef["destroyed"]) {
            this._changeDetectorRef.detectChanges();
        }
    }

    update(): void {
        this._computePosition();
    }

    protected _computePosition(): void {
        const appendToParent = this.floatUiOptions.appendTo && document.querySelector(this.floatUiOptions.appendTo);
        if (appendToParent) {
            const parent = this.elRef.nativeElement.parentNode;
            if (parent !== appendToParent) {
                parent && parent.removeChild(this.elRef.nativeElement);
                appendToParent.appendChild(this.elRef.nativeElement);
            }
        }

        const arrowElement = this.elRef.nativeElement.querySelector(".float-ui-arrow");
        const arrowLen = arrowElement.offsetWidth;
        // Get half the arrow box's hypotenuse length
        const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
        const parsedAutoAlignment: Alignment | undefined = (this.floatUiOptions.placement?.replace("auto-", "") || void 0) as Alignment | undefined;
        // Since "auto" doesn't really exist in floating-ui we pass undefined to have auto
        const parsedPlacement = !this.floatUiOptions.placement || this.floatUiOptions.placement.indexOf(NgxFloatUiPlacements.AUTO) === 0
            ? void 0
            : (this.floatUiOptions.placement as Placement);
        const popperOptions: Partial<ComputePositionConfig> = {
            placement: parsedPlacement,
            strategy: this.floatUiOptions.positionFixed ? "fixed" : "absolute",
            middleware: [
                offset(floatingOffset),
                ...(this.floatUiOptions.preventOverflow
                        ? [flip()]
                        : []
                ),
                shift({limiter: limitShift()}),
                arrow({
                    element: arrowElement,
                    padding: 4
                })
            ]
        };
        // Since preventOverflow uses "flip" and "flip" can't be used with "autoPlacement" we get here only if both conditions are falsy
        if (!this.floatUiOptions.preventOverflow && !popperOptions.placement) {
            const boundariesElement = this.floatUiOptions.boundariesElement
                ? document.querySelector(this.floatUiOptions.boundariesElement)
                : this.referenceObject.parentElement;
            popperOptions.middleware.push(
                autoPlacement({
                    crossAxis: !0,
                    alignment: parsedAutoAlignment,
                    autoAlignment: this.floatUiOptions.placement === NgxFloatUiPlacements.AUTO,
                    boundary: boundariesElement
                })
            );
        }
        computePosition(this.referenceObject, this.floatUiViewRef.nativeElement, {
            ...popperOptions
        })
            .then(({middlewareData, x, y, placement}) => {
                const side = placement.split("-")[0];
                this.floatUiViewRef.nativeElement.setAttribute("data-float-ui-placement", side);
                if (middlewareData.arrow) {
                    const staticArrowSide = this._staticArrowSides[side];
                    const dynamicArrowSide = this._dynamicArrowSides[side];
                    const dynamicSideAxis = this._sideAxis[dynamicArrowSide];
                    Object.assign(arrowElement.style, {
                        top: "",
                        bottom: "",
                        left: "",
                        right: "",
                        [dynamicArrowSide]: middlewareData.arrow[dynamicSideAxis] != null ? `${middlewareData.arrow[dynamicSideAxis]}px` : "",
                        [staticArrowSide]: `${-arrowLen / 2}px`
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
        // tslint:disable-next-line:no-string-literal
        if ($style["styleSheet"]) {
            // tslint:disable-next-line:no-string-literal
            $style["styleSheet"].cssText = styleContent;
            // This is required for IE8 and below.
        }
        else {
            $style.innerHTML = styleContent;
        }
    }

    protected _toggleVisibility(state): void {
        this.displayType = ["none", "block"][+state];
        this.opacity = +state;
        this.ariaHidden = `${!state}`;
        this.state = state;
    }
}
