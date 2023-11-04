import {NgxFloatUiArticleTypesRef} from "./ngx-float-ui-article-types.model";
import {NgxFloatUiPlacements} from "ngx-float-ui";

const positionEntries = Object.entries(NgxFloatUiPlacements);
// tslint:disable-next-line:naming-convention
export const getNgxFloatUiCodeMap = (positionValue: NgxFloatUiPlacements): NgxFloatUiArticleTypesRef => {
    const position = positionValue
        ? positionEntries.find(([, v]) => v === positionValue)[0]
        : "";

    return {
        popLoose: `<img alt="Popcorn box"
                     src="assets/images/popcorn-box.svg"
                     [popperLoose]="'My loose content with string placement'"
                     [popperLoosePlacement]="'TOP'"
                     class="pop-popcorn-box" />
`,
        click: `&lt;float-ui-content #popperClickContent&gt;
            &lt;/float-ui-content&gt;
&lt;img alt="Popcorn box" src="assets/images/popcorn-box.svg"
     [floatUi]="popperClickContent"
     trigger="click"
     [placement]="NgxFloatUiPlacements.BOTTOM"
     class="pop-popcorn-box"&gt;`,
        scroll: `&lt;float-ui-content #popperClickContent&gt;
            &lt;/float-ui-content&gt;
&lt;img alt="Popcorn box" src="assets/images/popcorn-box.svg"
     [floatUi]="popperClickContent"
     [hideOnScroll]="!0"
     trigger="click"
     [placement]="NgxFloatUiPlacements.TOP"
     class="pop-popcorn-box"&gt;`,
        flipping: `&lt;float-ui-content #myPopperContent&gt;
            I'm popper :)
            &lt;/float-ui-content&gt;
&lt;img alt="Popcorn box" src="assets/images/popcorn-box.svg"
     [floatUi]="myPopperContent"
     [showOnStart]="true"
     trigger="click"
     preventOverflow
     [placement]="NgxFloatUiPlacements.TOP"
     class="pop-popcorn-box"&gt;`,
        overflow: `&lt;float-ui-content #popcornPrices&gt;
 &lt;p class="pop-text-bold"&gt;POPCORN&lt;br /&gt;SIZE&lt;br /&gt;&amp; PRICE&lt;/p&gt;
 &lt;ul&gt;
     &lt;li&gt;XXS: $1.99&lt;/li&gt;
     &lt;li&gt;XS: $2.99&lt;/li&gt;
     &lt;li&gt;S: $3.99&lt;/li&gt;
     &lt;li&gt;M: $4.99&lt;/li&gt;
     &lt;li&gt;L: $5.99&lt;/li&gt;
     &lt;li&gt;XL: $6.99&lt;/li&gt;
     &lt;li&gt;XXL: $7.99&lt;/li&gt;
 &lt;/ul&gt;
 &lt;/float-ui-content&gt;
 &lt;img alt="Popcorn box" src="assets/images/popcorn-box.svg"
      [floatUi]="popcornPrices"
      [showOnStart]="true"
      trigger="click"
      [placement]="NgxFloatUiPlacements.RIGHT"
      class="pop-popcorn-box"&gt;`,
        position: `&lt;float-ui-content #myPopperContent&gt;
            I'm popper :)
            &lt;/float-ui-content&gt;
&lt;img alt="Popcorn box" src="assets/images/popcorn-box.svg"
     [floatUi]="myPopperContent"
     [showOnStart]="true"
     [hideOnClickOutside]="false"
     trigger="click"
     [placement]="NgxFloatUiPlacements.${position}"
     class="pop-popcorn-box"&gt;`,
        theming: `@use ngx-float-ui/css/theme-dark.css
/* OR */
@use ngx-float-ui/css/theme-white.css
/* OR */
@use ngx-float-ui/scss/theme-dark
/* OR */
@use ngx-float-ui/scss/theme-white
/* OR */
@include ngx-float-ui-theme(#777, #fff1e0);
`
    } as NgxFloatUiArticleTypesRef;
};
