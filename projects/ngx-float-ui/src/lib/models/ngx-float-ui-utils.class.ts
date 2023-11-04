/**
 * @private
 */
export class NgxFloatUiUtils {

    /** Coerces a data-bound value (typically a string) to a boolean. */
    static coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== "false";
    }
}
