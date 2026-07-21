import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    HostBinding,
    HostListener,
    OnDestroy,
    OnInit,
    Output,
    ViewContainerRef,
    inject
} from "@angular/core";
import {fromEvent, Subject, takeUntil, timer} from "rxjs";
//
import {NgxFloatUiContentComponent} from "../../components/ngx-float-ui-content/ngx-float-ui-content.component";
import {NGX_FLOAT_UI_DEFAULTS} from "../../models/ngx-float-ui-defaults.model";
import {NgxFloatUiOptions} from "../../models/ngx-float-ui-options.model";
import {NgxFloatUiPlacements} from "../../models/ngx-float-ui-placements.model";
import {NgxFloatUiTriggers} from "../../models/ngx-float-ui-triggers.model";
import {NgxFloatUiUtils} from "../../models/ngx-float-ui-utils.class";

@Directive({
    selector: "[floatUi]",
    exportAs: "floatUi"
})
export class NgxFloatUiDirective implements OnInit, OnDestroy {

    static baseOptions: NgxFloatUiOptions = {
        showDelay: 0,
        hideOnClickOutside: true,
        hideOnMouseLeave: false,
        hideOnScroll: false,
        appendTo: undefined,
        ariaRole: "tooltip",
        ariaDescribe: "",
        styles: {},
        trigger: NgxFloatUiTriggers.click
    };
    static nextId: number = 0;

    @Input()
    set applyClass(newValue: string) {
        if (newValue === this._applyClass) {
            return;
        }
        this._applyClass = newValue;
        this._checkExisting("applyClass", newValue);
    }

    get applyClass(): string {
        return this._applyClass;
    }

    @Input()
    set arrowClass(newValue: string) {
        if (newValue === this._arrowClass) {
            return;
        }
        this._arrowClass = newValue;
        if (this._content) {
            this._content.floatUiOptions.applyArrowClass = newValue;
            if (!this._shown) {
                return;
            }
            this._content.update();
        }
    }

    get arrowClass(): string {
        return this._arrowClass;
    }

    @Input()
    set disabled(newValue: boolean) {
        if (newValue === this._disabled) {
            return;
        }
        this._disabled = !!newValue;
        if (this._shown) {
            this.hide();
        }
    }

    get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    set floatUi(newValue: string | NgxFloatUiContentComponent) {
        if (newValue === this._floatUi) {

            return;
        }
        this._floatUi = newValue;
        if (this._content) {
            if (typeof newValue === "string") {
                this._content.text = newValue;
            }
            else {
                this._content = newValue;
            }
        }
    }

    get floatUi(): string | NgxFloatUiContentComponent {
        return this._floatUi;
    }

    @Input()
    set hideOnClickOutside(newValue: boolean | string) {
        this._hideOnClickOutside = NgxFloatUiUtils.coerceBooleanProperty(newValue);
    }

    get hideOnClickOutside(): boolean {
        return this._hideOnClickOutside;
    }

    @Input()
    set placement(newValue: NgxFloatUiPlacements) {
        this._placement = newValue;
        this._checkExisting("placement", newValue);
    }

    get placement(): NgxFloatUiPlacements {
        return this._placement;
    }

    @Input()
    set preventOverflow(newValue: boolean | string) {
        this._preventOverflow = NgxFloatUiUtils.coerceBooleanProperty(newValue);
        this._checkExisting("preventOverflow", this._preventOverflow);
    }

    get preventOverflow(): boolean {
        return this._preventOverflow;
    }

    @Input()
    set showOnStart(newValue: boolean | "") {
        this._showOnStart = NgxFloatUiUtils.coerceBooleanProperty(newValue);
    }

    get showOnStart(): boolean {
        return this._showOnStart;
    }

    @HostBinding("attr.aria-expanded")
    private get _ariaExpanded(): string {
        return `${this._shown}`;
    }

    @HostBinding("attr.aria-haspopup")
    private get _ariaHasPopup(): string | null {
        return this.ariaRole || "tooltip";
    }

    @HostBinding("attr.tabindex")
    private get _tabIndex(): string | null {
        const tagName = this._elementRef.nativeElement?.tagName?.toLowerCase();
        return ["a", "button", "input", "select", "textarea"].indexOf(tagName) > -1 ? null : "0";
    }

    @Input() appendTo!: string | undefined;
    @Input() ariaDescribe!: string | undefined;
    @Input() ariaRole!: string | undefined;
    @Input() boundariesElement!: string | undefined;
    @Input() disableAnimation!: boolean | undefined;
    @Input() disableStyle!: boolean | undefined;
    @Input() hideOnMouseLeave!: boolean | undefined;
    @Input() hideOnScroll!: boolean | undefined;
    @Input() hideTimeout: number = 0;
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onHidden: EventEmitter<NgxFloatUiDirective> = new EventEmitter<NgxFloatUiDirective>();
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onShown: EventEmitter<NgxFloatUiDirective> = new EventEmitter<NgxFloatUiDirective>();
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();
    @Input() positionFixed!: boolean | undefined;
    @Input() showDelay: number | undefined;
    @Input() showTrigger: NgxFloatUiTriggers | undefined;
    @Input() styles!: Record<string, string> | undefined;
    @Input() targetElement!: HTMLElement | undefined;
    @Input() timeoutAfterShow: number = 0;

    protected _applyClass!: string;
    protected _arrowClass!: string;
    protected _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected _content!: NgxFloatUiContentComponent;
    protected _contentClass = NgxFloatUiContentComponent;
    protected _contentRef!: ComponentRef<NgxFloatUiContentComponent>;
    protected _destroy$: Subject<void> = new Subject<void>();
    protected _disabled = !1;
    protected _elementRef: ElementRef = inject(ElementRef);
    protected _floatUi!: string | NgxFloatUiContentComponent;
    protected _globalEventListenersCtrl$: Subject<void> = new Subject<void>();
    protected _hideOnClickOutside: boolean = !0;
    protected _id: string = `ngx_float_ui_directive_${++NgxFloatUiDirective.nextId}`;
    protected _placement!: NgxFloatUiPlacements;
    protected _popperDefaults: NgxFloatUiOptions = inject(NGX_FLOAT_UI_DEFAULTS) || {};
    protected _preventOverflow = !1;
    protected _scheduledHideTimeoutCtrl$: Subject<void> = new Subject<void>();
    protected _scheduledShowTimeoutCtrl$: Subject<void> = new Subject<void>();
    protected _showOnStart: boolean = !1;
    protected _shown: boolean = !1;
    protected _vcr: ViewContainerRef = inject(ViewContainerRef);

    static assignDefined(target: NgxFloatUiOptions, ...sources: Partial<NgxFloatUiOptions>[]): NgxFloatUiOptions {
        for (const source of sources) {
            for (const key of Object.keys(source)) {
                const val = source[key as keyof NgxFloatUiOptions];
                if (val !== undefined) {
                    target[key as keyof NgxFloatUiOptions] = val as never;
                }
            }
        }

        return target;
    }

    applyTriggerListeners() {
        switch (this.showTrigger) {
            case NgxFloatUiTriggers.click:
                this._addListener("click", this.toggle.bind(this));
                break;
            case NgxFloatUiTriggers.mousedown:
                this._addListener("mousedown", this.toggle.bind(this));
                break;
            case NgxFloatUiTriggers.hover:
                this._addListener("mouseenter", this.scheduledShow.bind(this, this.showDelay));
                ["touchend", "touchcancel", "mouseleave"].forEach((eventName) => {
                    this._addListener(eventName, this.scheduledHide.bind(this, null, this.hideTimeout));
                });
                break;
        }
        if (this.showTrigger !== NgxFloatUiTriggers.hover && this.hideOnMouseLeave) {
            ["touchend", "touchcancel", "mouseleave"].forEach((eventName) => {
                this._addListener(eventName, this.scheduledHide.bind(this, null, this.hideTimeout));
            });
        }
    }

    getRefElement() {
        return this.targetElement || this._elementRef.nativeElement;
    }

    hide() {
        if (this.disabled) {
            return;
        }
        if (!this._shown) {
            this._scheduledShowTimeoutCtrl$.next();

            return;
        }

        this._shown = false;
        if (this._contentRef) {
            this._contentRef.instance.hide();
        }
        else {
            this._content.hide();
        }
        this.onHidden.emit(this);
        this._globalEventListenersCtrl$.next();
    }

    hideOnClickOutsideHandler($event: MouseEvent): void {
        if (this.disabled || !this.hideOnClickOutside || $event.target === this._content.elRef.nativeElement ||
            this._content.elRef.nativeElement.contains($event.target)) {
            return;
        }
        this.scheduledHide($event, this.hideTimeout);
    }

    hideOnScrollHandler($event: MouseEvent): void {
        if (this.disabled || !this.hideOnScroll) {
            return;
        }
        this.scheduledHide($event, this.hideTimeout);
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this._content?.clean();
    }

    ngOnInit() {
        if (typeof this.floatUi === "string") {
            this._content = this._constructContent();
            this._content.text = this.floatUi;
        }
        else if (typeof this.floatUi === typeof void 0) {
            this._content = this._constructContent();
            this._content.text = "";
        }
        else {
            this._content = this.floatUi;
        }
        const popperRef = this._content;
        popperRef.referenceObject = this.getRefElement();
        this._setContentProperties(popperRef);
        this._setDefaults();
        this.applyTriggerListeners();
        if (this.showOnStart) {
            this.scheduledShow();
        }
    }

    @HostListener("blur")
    onBlur() {
        if (this.showTrigger === NgxFloatUiTriggers.hover) {
            this.scheduledHide(null, this.hideTimeout);
        }
    }

    @HostListener("focus")
    onFocus() {
        if (this.showTrigger === NgxFloatUiTriggers.hover) {
            this.scheduledShow(this.showDelay);
        }
    }

    @HostListener("keydown.enter")
    @HostListener("keydown.space")
    onKeyboardActivate() {
        this.toggle();
    }

    @HostListener("keydown.escape")
    onKeyboardEscape() {
        this.hide();
    }

    scheduledHide($event: MouseEvent | null = null, delay: number = this.hideTimeout) {
        if (this.disabled) {
            return;
        }
        this._scheduledHideTimeoutCtrl$.next();
        timer(delay)
            .pipe(takeUntil(this._scheduledHideTimeoutCtrl$), takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    // TODO: check
                    const toElement = $event ? $event.relatedTarget : null;
                    const popperContentView = this._content.floatUiViewRef ? this._content.floatUiViewRef.nativeElement : false;
                    if (!popperContentView ||
                        popperContentView === toElement ||
                        popperContentView.contains(toElement) ||
                        (this.floatUi && (this.floatUi as NgxFloatUiContentComponent).isMouseOver)) {

                        return;
                    }
                    this.hide();
                    this._applyChanges();
                }
            });
    }

    scheduledShow(delay: number = this.showDelay ?? 0) {
        if (this.disabled) {
            return;
        }
        this._scheduledHideTimeoutCtrl$.next();
        timer(delay)
            .pipe(takeUntil(this._scheduledShowTimeoutCtrl$), takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    this.show();
                    this._applyChanges();
                }
            });
    }

    show() {
        if (this._shown) {
            this._scheduledHideTimeoutCtrl$.next();

            return;
        }

        this._shown = true;
        const popperRef = this._content;
        const element = this.getRefElement();
        if (popperRef.referenceObject !== element) {
            popperRef.referenceObject = element;
        }
        this._setContentProperties(popperRef);
        popperRef.show();
        this.onShown.emit(this);
        if (this.timeoutAfterShow > 0) {
            this.scheduledHide(null, this.timeoutAfterShow);
        }
        fromEvent<MouseEvent>(document, "click")
            .pipe(takeUntil(this._globalEventListenersCtrl$), takeUntil(this._destroy$))
            .subscribe({
                next: (e: MouseEvent) => {
                    return this.hideOnClickOutsideHandler(e);
                }
            });
        if (this.hideOnScroll) {
            fromEvent<Event>(this._getScrollParent(this.getRefElement()) as EventTarget, "scroll")
                .pipe(takeUntil(this._globalEventListenersCtrl$), takeUntil(this._destroy$))
                .subscribe({
                    next: (e: Event) => {
                        this.hideOnScrollHandler(e as MouseEvent);
                    }
                });
        }
    }

    toggle() {
        if (this.disabled) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this._shown ? this.scheduledHide(null, this.hideTimeout) : this.scheduledShow();
    }

    protected _addListener(eventName: string, cb: () => void): void {
        fromEvent<Event>(this._elementRef.nativeElement, eventName)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: () => cb()
            });
    }

    protected _applyChanges() {
        this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
    }

    protected _checkExisting(key: keyof NgxFloatUiOptions, newValue: NgxFloatUiOptions[keyof NgxFloatUiOptions]): void {
        if (this._content) {
            this._content.floatUiOptions = {
                ...this._content.floatUiOptions,
                [key]: newValue
            };
            if (!this._shown) {
                return;
            }
            this._content.update();
        }
    }

    protected _constructContent(): NgxFloatUiContentComponent {
        this._contentRef = this._vcr.createComponent(this._contentClass);

        return this._contentRef.instance as NgxFloatUiContentComponent;
    }

    protected _getScrollParent(node: Node | null): Node | Document | null {
        if (!node) {
            return null;
        }

        const isElement = node instanceof HTMLElement;
        const overflowY = isElement ? window.getComputedStyle(node).overflowY : "";
        const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

        if (isElement && isScrollable && node.scrollHeight > node.clientHeight) {
            return node;
        }

        return this._getScrollParent(node.parentNode) || document;
    }

    protected _onPopperUpdate() {
        this.onUpdate.emit();
    }

    protected _setContentProperties(popperRef: NgxFloatUiContentComponent) {
        popperRef.floatUiOptions = NgxFloatUiDirective.assignDefined(popperRef.floatUiOptions, NgxFloatUiDirective.baseOptions, {
            showDelay: this.showDelay,
            disableAnimation: this.disableAnimation,
            disableDefaultStyling: this.disableStyle,
            placement: this.placement,
            boundariesElement: this.boundariesElement,
            trigger: this.showTrigger,
            positionFixed: this.positionFixed,
            ariaDescribe: this.ariaDescribe,
            ariaRole: this.ariaRole,
            applyClass: this.applyClass,
            applyArrowClass: this.arrowClass,
            hideOnMouseLeave: this.hideOnMouseLeave,
            styles: this.styles,
            appendTo: this.appendTo,
            preventOverflow: this.preventOverflow
        });
        popperRef.onUpdate = this._onPopperUpdate.bind(this);
        popperRef.onHidden
            .pipe(takeUntil(this._destroy$))
            .subscribe(this.hide.bind(this));
    }

    protected _setDefaults() {
        const baseOptions = {...NgxFloatUiDirective.baseOptions, ...this._popperDefaults};
        this.showDelay = this.showDelay ?? baseOptions.showDelay;
        this.hideOnScroll = this.hideOnScroll ?? baseOptions.hideOnScroll;
        this.hideOnMouseLeave = this.hideOnMouseLeave ?? baseOptions.hideOnMouseLeave;
        this.hideOnClickOutside = this.hideOnClickOutside ?? baseOptions.hideOnClickOutside;
        this.ariaRole = this.ariaRole ?? baseOptions.ariaRole;
        this.ariaDescribe = this.ariaDescribe ?? baseOptions.ariaDescribe;
        this.showTrigger = this.showTrigger || baseOptions.trigger;
        this.styles = this.styles === void 0 ? {...baseOptions.styles} : this.styles;
    }

}
