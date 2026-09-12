/**
 * @private
 */
export class NgxFloatUiUtils {

    /** Coerces a data-bound value (typically a string) to a boolean. */
    static coerceBooleanProperty(value: unknown): boolean {
        return value != null && `${value}` !== "false";
    }
}
