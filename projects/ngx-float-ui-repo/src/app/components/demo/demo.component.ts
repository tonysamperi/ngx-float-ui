import {Component, OnInit} from "@angular/core";
import {NgFor} from "@angular/common";
import {
    NgxFloatUiPlacements,
    NgxFloatUiLooseDirective,
    NgxFloatUiDirective,
    NgxFloatUiContentComponent
} from "ngx-float-ui";
//
import {getNgxFloatUiCodeMap} from "../../shared/ngx-float-ui-code-map.const";
import {NgxFloatUiArticleTypes, NgxFloatUiArticleTypesRef} from "../../shared/ngx-float-ui-article-types.model";
//
import pkg from "../../../../../../package.json";
import {highlightElement} from "prismjs";
import {catchError, of, switchMap, timer} from "rxjs";
import {ajax, AjaxResponse} from "rxjs/ajax";
import TypeWriter from "typewriter-effect/dist/core.js";

const codeTypes: NgxFloatUiArticleTypesRef<"css" | "markup"> = {
    position: "markup",
    overflow: "markup",
    flipping: "markup",
    theming: "css",
    click: "markup",
    scroll: "markup"
};

@Component({
    selector: "app-demo",
    templateUrl: "demo.component.html",
    styleUrls: ["demo.component.scss"],
    imports: [NgFor, NgxFloatUiContentComponent, NgxFloatUiDirective, NgxFloatUiLooseDirective]
})
export class NgxFloatUiDemoComponent implements OnInit {

    get buildRef(): string {
        return `${pkg.version}-build-${pkg.build}`;
    }

    get codeMap(): NgxFloatUiArticleTypesRef<string> {
        return getNgxFloatUiCodeMap(this.selectedPosition);
    }

    messages: { opts?: { delay?: number | "natural"; loop?: boolean; }; text: string; }[] = [];
    popperPlacements: typeof NgxFloatUiPlacements = NgxFloatUiPlacements;
    // tslint:disable-next-line:no-bitwise
    positionButtons: NgxFloatUiPlacements[] = Object.values(NgxFloatUiPlacements).filter((v) => !~v.indexOf("auto"));
    selectedPosition: NgxFloatUiPlacements = this.positionButtons[0];
    year: number = new Date().getFullYear();

    ngOnInit(): void {
        Object.values(NgxFloatUiArticleTypes).forEach((s: NgxFloatUiArticleTypes) => this._updateCode(s));
        Array.from(document.querySelectorAll(".pop-popcorn-wrap")).forEach((el: HTMLElement) => el.scrollTop = 300);
        this._getMessages();
    }

    onPopperUpdate(): void {
        console.info("ON POPPER UPDATE FIRED!");
    }

    showAlert(): void {
        alert("Ciao!");
    }

    updatePosition(positionButton: NgxFloatUiPlacements): void {
        this.selectedPosition = positionButton;
        this._updateCode(NgxFloatUiArticleTypes.position);
    }

    private _getMessages(): void {
        ajax.get(`./assets/messages.json`)
            .pipe(
                switchMap((resp: AjaxResponse<any>) => {
                    this.messages = resp.response.messages;

                    return timer(150);
                }),
                catchError(() => of([]))
            )
            .subscribe({
                next: () => {
                    this.messages.forEach(({text, opts = {}}, i: number) => {
                        const tw = new TypeWriter(`[pop-messages] li:nth-child(${i + 1})`, {
                            strings: !!opts.loop ? [text] : void 0,
                            autoStart: !!opts.loop,
                            loop: !!opts.loop,
                            delay: opts.delay || "natural"
                        });
                        if (!opts.loop) {
                            tw.typeString(text).stop().start();
                        }
                        // else {
                        //     console.info("AUTOSTART WAS TRUE FOR", text);
                        // }
                    });
                }
            });
    }

    private _updateCode(key: NgxFloatUiArticleTypes): void {
        const $code = document.querySelector(`[pop-${key}-code]`);
        if (!$code) {
            return;
        }
        $code.classList.add(`language-${codeTypes[key] || "markup"}`);
        $code.innerHTML = this.codeMap[key];
        highlightElement($code);
    }

}
