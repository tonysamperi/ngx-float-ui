export enum NgxFloatUiArticleTypes {
    position = "position",
    overflow = "overflow",
    flipping = "flipping",
    theming = "theming",
    click = "click",
    scroll = "scroll"
}

export type NgxFloatUiArticleTypesRef<T = any> = { [key in NgxFloatUiArticleTypes]: T };
