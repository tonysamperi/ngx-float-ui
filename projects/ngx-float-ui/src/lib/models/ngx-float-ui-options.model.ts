import {NgxFloatUiTriggers} from "./ngx-float-ui-triggers.model";
import {NgxFloatUiPlacements} from "./ngx-float-ui-placements.model";

export interface NgxFloatUiOptions {
  appendTo?: string;
  applyArrowClass?: string;
  applyClass?: string;
  ariaDescribe?: string;
  ariaRole?: string;
  boundariesElement?: string;
  disableAnimation?: boolean;
  disableDefaultStyling?: boolean;
  hideOnClickOutside?: boolean;
  hideOnMouseLeave?: boolean;
  hideOnScroll?: boolean;
  placement?: NgxFloatUiPlacements;
  positionFixed?: boolean;
  preventOverflow?: boolean;
  showDelay?: number;
  styles?: {[key: string]: string};
  showTrigger?: NgxFloatUiTriggers;
}

export type NgxFloatUiOptionsKey = keyof NgxFloatUiOptions;
