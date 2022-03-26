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
     * @see [web component lifecycle](
     */
    connectedCallback(): void;
    initialized: boolean;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    onResponse(response: any): Promise<any>;
    error: string;
    contentType: any;
    responseHeaders: any;
    setContent(html: any): void;
    onResult(result: any): Promise<any>;
    render(data: any, contentType: any, httpCode: any, responseHeaders: any): void;
    renderHtml(data: any, contentType: any, httpCode: any, responseHeaders: any, ...args: any[]): Promise<void>;
    onError(error: any): any;
    getKeys(obj: any): string[];
}
export default FetchElement;
