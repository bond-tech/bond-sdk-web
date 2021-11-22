declare type Format = {
    replaceThis?: string;
    withThis?: string;
    count?: number;
};
/**
 * @classdesc Represents the Bond Cards SDK. It allows developers to make
 * all calls to the APIs that securely store PCI data with a single function.
 * @class
 */
declare class BondCards {
    BONDSTUDIO: string;
    internalShow: any;
    resetFormInstance: any;
    internalForm: any;
    fieldEnum: any;
    firstrun: boolean;
    /**
     * Create a BondCards instance.
     * @constructor
     * @param {boolean} [live=true] Set to True to work with live data.
     * False for sandbox data
     */
    constructor({ live }: {
        live: boolean;
    });
    _internalShowField(requestParams: {}): void;
    /**
     * @description Resolves promise only after iframe async operation is finished
     * @param {Object} requestParams A configuration needed for request
     * @param {String} htmlSelector A selector for the field/element where the
     * iFrame will be placed.
     * @param {Object} [css={}] An object of CSS rules to apply to the response.
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    _delayedPromise(requestParams: {}, htmlSelector: string, css: {}): Promise<unknown>;
    /**
     * The FieldType
     * @typedef {('number'|'cvv'|'expiry')} FieldType
     */
    _createRequestParams({ cardId, identity, authorization, field, htmlWrapper, format, }: {
        cardId: string;
        identity: string;
        authorization: string;
        field: string;
        htmlWrapper: string;
        format: Format;
    }): {
        serializers: any[];
        method: string;
        headers: {
            'Content-type': string;
            Identity: string;
            Authorization: string;
        };
        path: string;
        name: string;
        jsonPathSelector: any;
        htmlWrapper: string;
    };
    /**
     * @description Show card data including number, expiry, cvv
     * @param {String} cardId The unique ID used to identify a specific card.
     * @param {String} identity The temporary identity token allowing this call.
     * @param {String} authorization The temporary authorization token.
     * @param {FieldType} field The field to get/show
     * @param {String} [htmlWrapper="text"] The expected type of response data.
     * 'image' is wrapped in an <img src='<revealed_data>'/> HTML tag. 'text'
     * would be inserted into a <span> element inside the iframe.
     * @param {String} htmlSelector A selector for the field/element where the
     * iFrame will be placed.
     * @param {Object} [format] An object containing a regex pattern to find and
     * replace in the response.
     * @param {String} format.replaceThis String is to be replaced with the
     * new value. Please use the format where regexp is not enclosed between
     * slashes but do use quotation marks. ex: '(\\d{4})(\\d{4})(\\d{4})(\\d{4})'
     * @param {String} format.withThis The string that replaces the substring
     * specified by the specified regexp. ex: '$1-$2-$3-$4'
     * @param {String} [format.count] Optional, defines how many times a certain
     * string should be replaced.
     * @param {Object} [css={}] An object of CSS rules to apply to the response.
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    show({ cardId, identity, authorization, field, htmlWrapper, htmlSelector, format, css, }: {
        cardId: string;
        identity: string;
        authorization: string;
        field: string;
        htmlWrapper?: string;
        htmlSelector: string;
        format?: Format;
        css?: {};
    }): Promise<unknown>;
    /**
     * The FieldParams has all parameters regarding to card field
     * @typedef {Object} FieldParams
     * @property {String} [htmlWrapper="text"] The expected type of response data.
     * 'image' is wrapped in an <img src='<revealed_data>'/> HTML tag. 'text'
     * would be inserted into a <span> element inside the iframe.
     * @property {String} htmlSelector A selector for the field/element where the
     * iFrame will be placed.
     * @property {Object} [format] An objects containing a regex pattern to find and
     * replace.
     * @property {String} format.replaceThis String is to be replaced with the
     * new value. Please use the format where regexp is not enclosed between
     * slashes but do use quotation marks. ex: '(\\d{4})(\\d{4})(\\d{4})(\\d{4})'
     * @property {String} format.withThis The string that replaces the substring
     * specified by the specified regexp. ex: '$1-$2-$3-$4'
     * @property {String} [format.count] Optional, defines how many times a certain
     * string should be replaced.
     * @property {Object} [css={}] An object of CSS rules to apply to the response.
     */
    /**
     * @description Show multiple card data fields including number, expiry, cvv
     * @param {String} cardId The unique ID used to identify a specific card.
     * @param {String} identity The temporary identity token allowing this call.
     * @param {String} authorization The temporary authorization token.
     * @param {Object.<FieldType, FieldParams>} fields An object containing the fields to request
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    showMultiple({ cardId, identity, authorization, fields }: {
        cardId: string;
        identity: string;
        authorization: string;
        fields: Record<string, {
            htmlSelector: string;
            htmlWrapper?: string;
            format?: Format;
            css?: {};
        }>;
    }): any;
    /**
     * @description Show card PIN data
     * @param {String} cardId The unique ID used to identify a specific card.
     * @param {String} identity The temporary identity token allowing this call.
     * @param {String} authorization The temporary authorization token.
     * @param {Boolean} [reset=false] Reset the PIN and view
     * @param {String} [htmlWrapper="text"] The expected type of response data.
     * 'image' is wrapped in an <img src='<revealed_data>'/> HTML tag. 'text'
     * would be inserted into a <span> element inside the iframe.
     * @param {String} htmlSelector A selector for the field/element where the
     * iFrame will be placed.
     * @param {Object} [css={}] An object of CSS rules to apply to the response.
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    showPIN({ cardId, identity, authorization, reset, htmlWrapper, htmlSelector, css, }: {
        cardId: string;
        identity: string;
        authorization: string;
        reset?: boolean;
        htmlWrapper?: string;
        htmlSelector: string;
        css?: {};
    }): Promise<unknown>;
    /**
     * @description Initilize a Field in a Form to submit for card manipulation
     * @param {String} selector CSS selector that points to the element where
     * the field will be added.
     * @param {('current_pin'|'new_pin'|'confirm_pin')} type The type of the field targeted.
     * @param {Object} [css={}] An object of CSS rules to apply to the field.
     * @param {String} [placeholder] Text displayed when the field is empty.
     * @param {String} [successColor] Text color when the field is valid.
     * @param {String} [errorColor] Text color when the field is invalid.
     * @param {String} [color] Text color.
     * @param {String} [lineHeight] Line height value.
     * @param {String} [fontSize] Size of text.
     * @param {String} [fontFamily] font family used in the text.
     * @param {Boolean} [disabled] Specifies that the input field is disabled.
     * @param {Boolean} [readOnly] Specifies that the input field is read only.
     * @param {String} [autoFocus] Specifies that the input field should
     * automatically get focus when the page loads.
     * @param {Boolean} [hideValue=true] Specifies that the input field should be masked with ****
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either initialize the field or return an error.
     */
    field({ selector, type, css, placeholder, successColor, errorColor, color, lineHeight, fontSize, fontFamily, disabled, readOnly, autoFocus, hideValue, }: {
        selector: string;
        type: string;
        css?: {};
        placeholder: string;
        successColor: string;
        errorColor: string;
        color?: string;
        lineHeight?: string;
        fontSize?: string;
        fontFamily?: string;
        disabled?: boolean;
        readOnly?: boolean;
        autoFocus?: boolean;
        hideValue?: boolean;
    }): Promise<unknown>;
    /**
     * @description Copy card data (one of number, expiry, cvv)
     * @param {Object} iframe An iframe object returned from show method
     * @param {String} htmlSelector A selector for the field/element where the
     * iFrame will be placed.
     * @param {Object} [css={}] An object of CSS rules to apply to the response.
     * @param {String} [text='Copy'] A text for button.
     * @param {Function} [callback=function(){}] A function to call when copy handler called.
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    copy({ iframe, htmlSelector, css, text, callback }: {
        iframe: HTMLIFrameElement;
        htmlSelector: string;
        css?: {};
        text?: string;
        callback?: (status: string) => void;
    }): Promise<unknown>;
    /**
     * @callback successCallback
     * @param {String} status HTTP status code of HTTPRequest
     * @param {Object} response Data object of the response
     */
    /**
     * @callback errorCallback
     * @param {Object} errors Object of the error messages
     */
    /**
     * @description Show appropriate card data
     * @param {String} cardId The unique ID used to identify a specific card.
     * @param {String} identity The temporary identity token allowing this call.
     * @param {String} authorization The temporary authorization token.
     * @param {String} currentPin The value of the current pin number.
     * @param {String} newPin The value of the new pin number.
     * @param {successCallback} callback Function that will be executed
     * when the HTTPRequest has finished successfully.
     * @param {errorCallback} callback Function Error handling callback. Will be
     * triggered if one of the fields has an invalid value on submit. By default,
     * it will push the error messages to the console.
     * @return {Promise} Returns a Promise that, when fulfilled,
     * will either return an iFrame with the appropriate data or an error.
     */
    submit({ cardId, identity, authorization, currentPin, newPin, successCallback, errorCallback, }: {
        cardId: string;
        identity: string;
        authorization: string;
        currentPin?: string;
        newPin: string;
        confirmPin?: string;
        successCallback: (status: number, data: {
            card_id: string;
            pin_changed: boolean;
        }) => void;
        errorCallback: (errors: Record<string, object>) => void;
    }): Promise<unknown>;
    /**
     * @description Reset the form or a field
     */
    reset(): any;
}
export default BondCards;
