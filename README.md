# fetch-element & slotted-element

are covering the typical UI tasks:
1. fetch data via [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. populate data into UI via custom render callback or provided content-type sensitive renderers: JSON to table or html.
3. control UI parts(slots) depending on fetch state.

[![git](https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/mark-github.svg) GitHub](https://github.com/sashafirsov/slotted-element)
| [demo TBD](https://cdn.xml4jquery.com/ajax/libs/embed-page/0.0.21/build/esm-unbundled/demo/index.html)
| [tests project](https://github.com/sashafirsov/slotted-element-test)
[![NPM version][npm-image]][npm-url]
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/slotted-element)

As slots **without shadow DOM** primarily would be used for displaying remotely fetched data, 
the `slotted-element` is derived from `fetch-element`.

# Use
1. if JS served by CDN as in demo, skip this step. Otherwise add `slotted-element` dependency into project via package manager 
   like npm, yarn, bower, bit.dev. 
   Or simply clone `fetch-element.js` and `slotted-element.js` into project tree
2. Import into page/module either by ES6 import or simple SCRIPT tag
3. In page body add  ```<fetch-element src="url/to/some.html"></fetch-element>``` or 
   
```
    <slotted-element src="url/to/some.json">
        <i slot="loading"> Loading... please wait. </i>
        <i slot="errror"> System error, please try again.  </i>
        <fieldset>
            <legend>Object or array from JSON</legend>
            <div slot="done"></div>
        </fieldset>
   </slotted-element>       
```

# slotted-element
Gives ability to use slots **without shadowDOM** and exposes API to work with slots programmatically by adding and 
removing slots by slot name.

Coupled with `fetch-element` it provides UI management for each stage of data fetch and transforming to UI.  

The slots concept is described in 
[using slots in MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots#adding_flexibility_with_slots)

Originally it works in conjunction with shadowDOM when slots defined in content of element and referenced in 
rendered shadowDOM by name. I.e. rendered DOM defines which slot and where will be displayed inside of web component.

`slotted-element` gives ability to manipulate slots programmatically without engaging shadows dom.

## API
* `slotsInit()` read slots from internal DOM to be cloned later by
* `slotClone( name )` returns node (clone of slot subtree) to be modified before insertion by
* `slotAdd( node )` adds slot clone node to internal content immediately after original slot
* `slotAdd( name )` clones slot node and inserts immediately after original slot
* `slotsClear()` removes cloned slots from internal DOM

Overrides for `fetched-element` to support following fetch() lifecycle slots `loading`, `error`, `done`;
* `fetch`, `onResponse`, `onResult`, `onError` overrides of `fetch-element` to switch slots according to state change

### Attributes

# fetch-element

1. exposes interruptible [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as web component. 
2. Input parameters and result are exposed via element attributes
3. Provides default rendering for HTML and JSON as table
4. Exposes overriding methods for `fetch()` and render life cycle  

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
  Returns
    * html string to be populated as internal content or
    * true to state that internally provided rendering should be omitted.
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


[npm-image]:      https://img.shields.io/npm/v/slotted-element.svg
[npm-url]:        https://npmjs.org/package/slotted-element