/// <reference lib="dom" />
/**
 * @returns Promise resolved when updated DOM is rendered by calling [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
 * @param cb callback invoked on dom rendered, its return value passed back to wait4DomUpdated promise
 */
export function wait4DomUpdated<T>(cb: ()=>T): Promise<T>;

/**
 * @returns string lovercased with spaces replaces with dash '-'
 * @param s string to convert
 */
export function toKebbabCase(s: string): string;

/**
 * webcomponent renders JSON and other content types retrieved by interruptible
 * [ fetch() ](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) api
 * [more...](https://github.com/sashafirsov/slotted-element#fetch-element)
 */
export class FetchElement extends HTMLElement {
    /**
     *  @see [using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
     */
    static get observedAttributes(): string[];

    /**
     * override this map the content type to module loader function
     * @see [json remdering module](https://github.com/sashafirsov/slotted-element/blob/main/render/json.js) sample
     */
    static get mime2mod(): {
        'application/json': () => Promise<typeof import("./render/json.js").default>;
        'text/html': () => (data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]) => Promise<void>;
        'text/xml': () => (data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]) => Promise<void>;
        'application/xml': () => (data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]) => Promise<void>;
        'image/svg+xml': () => (data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]) => Promise<void>;
    };

    /**
     * override to override the request headers
     */
    get headers(): {[key:string]:string};

    /**
     * interrupt current request
     * @see [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
     */
    abort(): void;

    /**
     * @see [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
     * @param args
     */
    fetch( url:Request | string, options ): Promise<any>;

    /**
     * private
     */
    _fetch: (url: any, options: any) => Promise<any>;
    /**
     * string representing the loading to rendering life cycle
     */
    state: 'loading'|'rendering'|'loaded'|'error';
    /**
     * response.status, set by onResponse() handler, matching http error code
     */
    status: string;

    /**
     * @see [web component lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
     */
    connectedCallback(): void;

    /**
     * set to true when fetch is initialized
     */
    initialized: boolean;
    /**
     * @see [web component lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
     */
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;

    /**
     * callback when `fetch()` is resolved.
     * Sets `status`, `contentType`, `responseHeaders` and resolves the method for data
     *   conversion according to content type.
     * @param response
     * @returns data promise from `response.json()` or `response.text()`
     */
    onResponse(response: any): Promise<any>;

    /**
     * set by `onResponse()` to 'network error' in case of http code not in 200 range
     */
    error: string;
    /**
     * response.headers.get( 'content-type' )
     */
    contentType: string;
    /**
     * response.headers
     */
    responseHeaders: any;

    /**
     * pre-render callback to massage response data before `render()`
     * @param data
     */
    setContent(data: any): void;

    /**
     * callback which check the contentType and invokes renderer from `mime2mod` map
     * @param result
     */
    onResult(result: any): Promise<any>;

    /**
     * callback to override the output HTML according to response outcome.
     * @param data
     * @param contentType
     * @param httpCode
     * @param responseHeaders
     */
    render(data: any, contentType: any, httpCode: any, responseHeaders: any): void;

    /**
     * default rendering implementation which triggers  data and html transformation
     * @param data
     * @param contentType
     * @param httpCode
     * @param responseHeaders
     * @param args
     */
    renderHtml(data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]): Promise<void>;

    /**
     * callback on `fetch()` failure
     * @param error
     * @returns value for rejected promise
     */
    onError(error: any): any;

    /**
     * override to limit or define the order of keys on json object to be rendered in table.
     * @param obj
     * @returns array of keys to be shown in HTML
     */
    getKeys(obj: any): string[];
}
export default FetchElement;
