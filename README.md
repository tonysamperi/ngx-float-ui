# ngx-float-ui  

[![npm][badge-npm-version]][url-npm] [![npm][badge-npm-downloads]][url-npm] [![MIT licensed][badge-licence]][url-licence] [![Build state][badge-ci-state]][url-ci-state] [![Size][badge-bundle]][url-bundle] [![Rate this package][badge-openbase]][url-openbase]

ngx-float-ui is an angular wrapper for the [FloatingUI](https://floating-ui.com/) library (v ^1.5.3).

## VERY IMPORTANT READ THIS
I'm moving this to the top because it appears that people don't get to reading it in the **contribute** section.
FOR THIS LIBRARY **PLEASE USE ISSUES ONLY FOR BUG REPORTING**. DON'T OPEN ISSUES SUCH AS "I need upgrade for Angular 1745646456" especially if Angular 1745646456 was released a few days ago.
I **guarantee** that I manage the updates **AS SOON AS POSSIBLE**. But as you understand this is not a paying job, so you can't get Angular 1745646456 the day it gets released.
**ISSUES NOT RESPECTING THIS WILL BE DELETED IMMEDIATELY WITHOUT ANY RESPONSE**.
Thank you.

### Premise

The goal of this library is to adopt the more promising technology of floating-ui instead of popper.js and make it available in our Angular projects.

### Installation

node and npm are required to run this package.

1. Use npm/yarn to install the package:

  ```terminal
  $ npm install @floating-ui/dom ngx-float-ui --save
  ```
  
  Or 
  
   ```terminal
    $ yarn add @floating-ui/dom --save
    $ yarn add ngx-float-ui --save 
  ```

2. You simply add into your module `NgxFloatUiModule`:

  ```typescript
  import {NgxFloatUiModule} from 'ngx-float-ui';
  
  @NgModule({
   // ...
   imports: [
     // ...
     NgxFloatUiModule
   ]
  })
  ```

Optionally you can include in your `styles.css` / `styles.css` one of the prebuilt themes:
* `@import node_modules/ngx-float-ui/css/theme-dark.css`
* `@import node_modules/css/theme-white.css`

* `@use ngx-float-ui/scss/theme as floatUiBaseTheme`
* `@use ngx-float-ui/scss/theme-dark as floatUiDarkTheme`
* `@use ngx-float-ui/scss/theme-white floatUiWhiteTheme`

or easily create your own theme using the @mixin:

```
@use "ngx-float-ui/scss/theme" as floatUiBaseTheme;

body {
    @include floatUiBaseTheme.ngx-float-ui-theme($background-color, $text-color, $max-width, $z-index);
}
```

3. Add to view:

  ```HTML  
   <float-ui-content #popper1Content>
       <p class="bold">Popper on bottom</p>
   </float-ui-content>
   <div [floatUi]="popper1Content"
        [showOnStart]="true"
        [showTrigger]="'click'"
		hideOnClickOutside
        [hideOnScroll]="true"
        [placement]="'bottom'">
       <p class="bold">Hey!</p>
       <p class="thin">Choose where to put your popper!</p>         
   </div>
  ```

4. As text:
 ```HTML
      <div floatUi="As text"
           [showTrigger]="'hover'"
           [placement]="'bottom'"
           (onShown)="onShown($event)">
        <p class="bold">Pop</p>
        <p class="thin">on the bottom</p>
      </div>
 ```

  ```HTML
       <div floatUi="{{someTextProperty}}"
            [showTrigger]="'hover'"
            [placement]="'bottom'"
            [styles]="{'background-color: 'blue''}"
            (onShown)="onShown($event)">
         <p class="bold">Pop</p>
         <p class="thin">on the bottom</p>
       </div>
  ```
 
  5. Position fixed, breaking overflow:
   ```HTML
        <div floatUi="As text"
             [showTrigger]="'hover'"
             [placement]="'bottom'"
             [positionFixed]="true"
             (onShown)="onShown($event)">
        </div>
   ```
 
 6. Specific target:
  ```HTML
 <div class="example">
       <div #popperTargetElement></div>
       <div floatUi="As text"
            showTrigger="hover"
            placement="bottom"
            [targetElement]="popperTargetElement.nativeElement"
            (onShown)="onShown($event)">
       </div>
  ```
  
7. hide/show programmatically:
  ```HTML
   <div [floatUi]="tooltipcontent"
        showTrigger="hover"
        placement="bottom"
        [applyClass]="'popperSpecialStyle'">
        <p class="bold">Pop</p>
        <p class="thin">on the bottom</p>
      </div>
      <float-ui-content #tooltipcontent>
        <div>
          <p>This is a tooltip with text</p>
          <span (click)="tooltipcontent.hide()">Close</span>
        </div>
      </float-ui-content>
  ```
 
8. Attributes map:  
  
    | Option             | Type              | Default   | Description                                                                            |
    |:-------------------|:----------------  |:--------- |:---------------------------------------------------------------------------------------|
    | disableAnimation   | boolean           | false     | Disable the default animation on show/hide                                             |
    | disableStyle       | boolean           | false     | Disable the default styling                                                            |
    | disabled           | boolean           | false     | Disable the popper, ignore all events                                                  |
    | showDelay          | number            | 0         | Delay time until popper it shown                                                       |
    | hideTimeout        | number            | 0         | Set delay before the popper is hidden                                                  |
    | timeoutAfterShow   | number            | 0         | Set a time on which the popper will be hidden after it is shown                        |
    | placement          | Placement(string) | auto      | The placement to show the popper relative to the reference element *                   |
    | targetElement      | HtmlElement       | auto      | Specify a different reference element other the the one hosting the directive          |
    | boundaries         | string(selector)  | undefined | Specify a selector to serve as the boundaries of the element                           |
    | showOnStart        | boolean           | false     | Popper default to show                                                                 |
    | showTrigger        | Trigger(string)   | click     | Trigger/Event on which to show/hide the popper                                         |
    | positionFixed      | boolean           | false     | Set the popper element to use position: fixed                                          |
    | appendTo           | string            | undefined | append The popper-floatUi element to a given selector, if multiple will apply to first |
    | preventOverflow    | boolean           | undefined | Prevent the popper from being positioned outside the boundary *                        |
    | hideOnClickOutside | boolean           | true      | Popper will hide on a click outside                                                    |
    | hideOnScroll       | boolean           | false     | Popper will hide on scroll                                                             |
    | hideOnMouseLeave   | boolean           | false     | Popper will hide on mouse leave                                                        |
    | applyClass         | string            | undefined | list of comma separated class to apply on ngpx__container                              |
    | styles             | Object            | undefined | Apply the styles object, aligned with ngStyles                                         |
    | applyArrowClass    | string            | undefined | list of comma separated class to apply on ngpx__arrow                                  |
    | onShown            | EventEmitter<>    | $event    | Event handler when popper is shown                                                     |
    | onHidden           | EventEmitter<>    | $event    | Event handler when popper is hidden                                                    |
    | onUpdate           | EventEmitter<>    | $event    | Event handler when popper is updated                                                   |
    | ariaDescribeBy     | string            | undefined | Define value for aria-describeby attribute                                             |
    | ariaRole           | string            | popper    | Define value for aria-role attribute                                                   |

\* **VERY IMPORTANT**: All the "auto" placements can't be used in combo with prevent overflow (as per float-ui specs), because the two algorythms **would conflict**, ending in infinite repositioning.
See [here](https://floating-ui.com/docs/autoPlacement#usage)

9. Override defaults:

    ngx-float-ui comes with a few default properties you can override in default to effect all instances
    These are overridden by any child attributes.

```JavaScript
NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgxFloatUiModule.forRoot({placement: NgxFloatUiPlacements.TOP})],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent]

});
```
  
   | Options               | Type                             | Default   |
   |:----------------------|:---------------------------------|:----------|
   | showDelay             | number                           | 0         |
   | disableAnimation      | boolean                          | false     |
   | disableDefaultStyling | boolean                          | false     |
   | placement             | NgxFloatUiPopPlacements (string) | auto      |
   | boundariesElement     | string(selector)                 | undefined |
   | showTrigger           | NgxFloatUiTriggers (string)      | hover     |
   | positionFixed         | boolean                          | false     |
   | hideOnClickOutside    | boolean                          | true      |
   | hideOnMouseLeave      | boolean                          | false     |
   | hideOnScroll          | boolean                          | false     |
   | applyClass            | string                           | undefined |
   | styles                | Object                           | undefined |
   | applyArrowClass       | string                           | undefined |
   | ariaDescribeBy        | string                           | undefined |
   | ariaRole              | string                           | undefined |
   | appendTo              | string                           | undefined |
   | preventOverflow       | boolean                          | undefined |

10. NgxFloatUiPopPlacements:

  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'bottom-start'
  | 'left-start'
  | 'right-start'
  | 'top-end'
  | 'bottom-end'
  | 'left-end'
  | 'right-end'
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  
11. NgxFloatUiTriggers:

  | 'click'
  | 'mousedown'
  | 'hover'
  | 'none'

### Liking hardcoded strings everywhere? Too lazy to use Enums? No problem mate!

`floatUiLoose` is what you're looking for!

You can then use `loosePlacement` and `looseTrigger` passing the values above as strings!
    
### Demo site with sample codes
<a href="https://tonysamperi.github.io/ngx-float-ui/">Demo of ngx-float-ui</a>

### Contribute
  You can only **report bugs**. Every other issue will be deleted right away.
  
```terminal
  $ npm install
  $ npm run start  //run example
```

## Special thanks

Jetbrains is now supporting this library with an open-source license, which will allow a better code! 🎉

![jetbrains-logo](https://user-images.githubusercontent.com/5957244/150580991-863d6fba-1090-4924-b26c-be19c6310f24.svg)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

### Thanks to

The developers of Floating UI

[badge-bundle]: https://img.shields.io/bundlephobia/minzip/ngx-float-ui
[badge-ci-state]: https://github.com/tonysamperi/ngx-float-ui/actions/workflows/main.yml/badge.svg
[badge-licence]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-npm-downloads]: https://img.shields.io/npm/dm/ngx-float-ui.svg?style=flat-square
[badge-npm-version]: https://img.shields.io/npm/v/ngx-float-ui.svg?style=flat-square
[badge-openbase]: https://badges.openbase.com/js/rating/ngx-float-ui.svg
[url-bundle]: https://img.shields.io/bundlephobia/minzip/ngx-float-ui
[url-ci-state]: https://github.com/tonysamperi/ngx-float-ui/actions
[url-licence]: https://github.com/tonysamperi/ngx-float-ui/blob/master/LICENSE
[url-npm]: https://www.npmjs.com/package/ngx-float-ui
[url-openbase]: https://openbase.com/js/ngx-float-ui
