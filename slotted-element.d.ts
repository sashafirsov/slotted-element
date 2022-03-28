export * from "./fetch-element.js";
export class SlottedElement extends FetchElement {
    /**
     * @see [web component lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
     */
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;

    /**
     * attribute with id of html element used as template [see light DOM](https://github.com/sashafirsov/css-chain#light-dom-api)
     */
    template: string;

    /**
     * [CssChain](https://github.com/sashafirsov/css-chain) of slotted-elemt children defined by `css`
     * @param css
     */
    $<T>(css: undefined|string): CssChainCollection<T>&T;

    /**
     * @see [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
     * @param args
     */
    fetch( url:Request | string, options ): Promise<any>;
    /**
     * pre-render callback to massage response data before `render()`
     * @param data
     */
    setContent(data: any): void;

    /**
     * read slots from internal DOM. Has to be called before any slots operations.
     */
    slotsInit(): void;

    /**
     * hashmap of slot name to slot used internally
     */
    slots: {};

    /**
     * hide all slots except of named one by setting/removing `hidden` attribute
     * @param name
     */
    slotOnly(name: string): void;

    /**
     * remove all slots clones
     */
    slotsClear(): void;

    /**
     * returns node (clone of slot subtree) to be modified before insertion by `slotAdd()`
     * @param name
     */
    slotClone(name: string): Node;

    /**
     * adds slot clone node to internal content immediately after original slot
     * @param node name or node created by slotClone(name)
     */
    slotAdd(node: Node): Node;

    /**
     * clones slot node and inserts immediately after original slot
     * @param nodeName name or node created by slotClone(name)
     */
    slotAdd(nodeName: string): Node;
}
export default SlottedElement;
export { $ as CssChain };
import FetchElement from "./fetch-element.js";
import {CssChain as $, CssChainCollection, CssChainT} from "css-chain";
