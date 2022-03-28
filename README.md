# fetch-element & slotted-element

are covering the typical UI tasks:
1. fetch data via [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. populate data into UI via custom render callback or provided content-type sensitive renderers: JSON/XML data to table,
   inline for HTML/SVG (aka html import); exposes customize-able transformation pipeline.
3. control UI parts(slots) depending on fetch state.

[![git](https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/mark-github.svg) GitHub](https://github.com/sashafirsov/slotted-element)
| Demo: [slotted-element](https://unpkg.com/slotted-element@1.1.1/dist/bundle/demo/index.html)
, [fetch-element JSON as table](https://unpkg.com/slotted-element@1.1.1/dist/bundle/demo/render-from-json.html)
| [tests project](https://github.com/sashafirsov/slotted-element-test)

[![NPM version][npm-image]][npm-url]
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/slotted-element)
[![coverage][coverage-image]][coverage-url]

As slots **without shadow DOM** primarily would be used for displaying remotely fetched data, 
the `slotted-element` is derived from `fetch-element`.

# Use
## install
    npm i -P slotted-element
## or use binary bundle from CDN
```js
    <script type="module" scr="https://unpkg.com/slotted-element-test@1.1/dist/bundle/slotted-element.js"></script>
```
The size of binary distribution bundle along with its dependency [CssChain](https://github.com/sashafirsov/css-chain) 
is 11Kb. Bundle has export of `SlottedElement` along with `CssChain`.

1. if JS served by CDN as in demo, skip this step. Otherwise, add `slotted-element` dependency into project via 
   package manager like npm, yarn, bower, bit.dev.
2. Import into page/module either by ES6 import or simple SCRIPT tag
3. In page body add  
```html 
<fetch-element src="url/to/some.html"></fetch-element>
or  
<slotted-element src="url/to/some.json">
    <i slot="loading"> Loading... please wait. </i>
    <i slot="errror"> System error, please try again.  </i>
    <fieldset>
        <legend>Object or array from JSON</legend>
        <div slot="done"></div>
    </fieldset>
</slotted-element>       
```
![screenshot][screenshot]

# slotted-element
Gives ability to use slots 
**without [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)** 
and exposes API to work with slots programmatically by adding and removing slots by slot name.

Coupled with `fetch-element`, it provides UI management for each stage of data fetch and UI transformation.  

The slots concept is described in 
[using slots in MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots#adding_flexibility_with_slots)

Originally slots are designed to work in conjunction with template and shadowDOM when slot values are defined in content of 
element and referenced in rendered shadowDOM by name. I.e. template DOM defines which slot and where will be displayed 
inside of web component.

## Template vs inline HTML
If the `template` is defined as getter method, property, or attribute then
    
    slotted-element simulates the usual ShadowDOM slots handling by template cloning into local DOM and 
    placing the slots from inner DOM into template clone. Unlike in ShadowDOM this is less efficient as template DOM 
    is not reused and inner DOM has to be re-build.

Without `template` property defined the inner content is uses as template: 
    
inner DOM is shown except of elements with slot attribute. It is up to application code to trigger the visibility 
of particular slots. `embed-page` activates slots for fetch-element handling when `src` attribute is set.

Using inline HTML is handy in CMS or publishing systems when content is authored by editors rather than developers. 
It is more performant than separate template as there is no content cloning involved.   

## API
* `slotsInit()` read slots from internal DOM to be cloned later by
* `slotClone( name )` returns node (clone of slot subtree) to be modified before insertion by
* `slotAdd( node )` adds slot clone node to internal content immediately after original slot
* `slotAdd( name )` clones slot node and inserts immediately after original slot
* `slotsClear()` removes cloned slots from internal DOM

Overrides for `fetched-element` to support following fetch() lifecycle slots `loading`, `error`, `loaded`;
* `fetch`, `onResponse`, `onResult`, `onError` overrides of `fetch-element` to switch slots according to state change

### Attributes

# fetch-element

1. exposes interruptible [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as web component. 
2. Input parameters and result are exposed via element attributes
3. Provides default rendering for JSON and XML as table, inline SVG and HTML
4. Exposes overriding methods for `fetch()` and render life cycle  

The rendering code is loading on demand according to `content-type` 
reducing initial JS size to 4.5kb uncompressed / 1.7 gzipped.

## API
* `get headers()` override to set headers programmatically is no matching attribute is given
* `async fetch( url, options )` invokes native `fetch()` API. return Promise resolved upon data rendering.
* `abort()` interrupts ongoing http request.
fetch lifecycle overrides:
* `async onResponse( response )` sets `status`, `contentType`, `responseHeaders` and resolves the method for data 
  conversion according to content type. 
  Returns data promise from `response.json()` or `response.text()`
* `async onResult( result )` - called when data available. 
  Invokes `render( data, contentType, code )` callback and if it does not return anything 
  renders content either from JSON as table or text as HTML
  Sets `state="loaded"`

Callbacks:
* `render( data, contentType, code, responseHeaders )` callback allows to apply data 
  which could be used for inner DOM changing.
  Returns either
    * `html string` to be populated as internal content or
    * `true` to state that internally provided rendering should be omitted.
* `onError( error )`
* `json2table( data )` - default render JSON object or array to table. Override for custom render. Return html string.
* `getKeys( obj )` - override to limit or define the order of keys on json object to be rendered in table.

    
### attributes
all attributes reflected as component properties
* `src` - url for data retrieval ( `data:` as url TBD )
* `method` - http method  
* `headers` - JS expression to be evaluated as string key-value object
* `state` - '' or one of `loading`( fetch started ), `rendering`, `loaded`, `error`
* `status` - http code response.status
* `skiprender` - set to 'true' to omit response rendering. Used when binding to fetch-element via events.

NOTE: for defining the payload in http request leave `src` undefined and call `fetch(url, options)` with needed parameters
 
## rendering by CSS
`fetch-element` could be self-sufficient without using a slots pattern: the `state` attribute is available to trigger 
visibility of internal dom subtree branches by `[state="xxx"] ...` selector. 


## Credits
The `fetch-element` is inspired by ideas of [iron-ajax](https://github.com/PolymerElements/iron-ajax) in regards of
using properties for declarative programming. Unlike `iron-ajax` in `fetch-element` the primary use is not in data share 
via binding (which requires framework like PolymerJS) but in response rendering as table. 
The data and content rendering customization is done by callbacks via inheritance or runtime methods override.

# test and demo
reside in separate repository https://github.com/sashafirsov/slotted-element-test to avoid unnecessary dependency in 
source repo and npm.

# Typescript
`import SlottedElement from 'slotted-element'` code has [typings](slotted-element.d.ts) along with JSDoc enabled. 

# dependencies
[CssChain](https://github.com/sashafirsov/css-chain) for Light DOM implementation, and a browser with Web Components support.

[npm-image]:      https://img.shields.io/npm/v/slotted-element.svg
[npm-url]:        https://npmjs.org/package/slotted-element
[screenshot]:   ./demo/Screenshot-fetch-element.png
[coverage-image]: https://unpkg.com/slotted-element-test@1.1.1/coverage/coverage.svg
[coverage-url]:   https://unpkg.com/slotted-element-test@1.1.1/coverage/lcov-report/index.html
