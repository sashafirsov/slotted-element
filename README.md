# fetch-element and slotted-element
<a href="https://github.com/sashafirsov/slotted-element">
    <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" width="32" height="32" alt="github link"/></a>

covering the typical UI tasks:
1. fetch data via [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. populate data into UI via custom render callback or included content-type sensitive renderers: JSON to table or html.
3. control UI parts(slots) depending on fetch state. 

As slots **without shadow DOM** primarily would be used for remotely fetched data render, 
the `slotted-element` is derived from `fetch-element`.

# Use
1. if use CDN, skip this step. Otherwise add `slotted-element` dependency to project via package manager like npm, yarn, bower, bit.dev. 
   Or simply place `fetch-element.js` and `slotted-element.js` into project tree
2. Import into page/module either by ES6 import, simple SCRIPT tag
3. Include   ```<fetch-element src="url/to/some.html">``` or 
   
    ```
    <slotted-element src="url/to/some.json">
        <i slot="loading"> Loading... please wait. </i>
        <i slot="errror"> System error, please try again.  </i>
        <frameset>
            <legend>Object or array from JSON</legend>
            <div slot="done"></div>
        </frameset>
   </slotted-element>    
    ```

# slotted-element
1. Exposes API to work with slots programmatically by adding and removing slots by slot name.

The slots concept is described in 
[using slots in MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots#adding_flexibility_with_slots)

Originally it works in conjunction with shadowDOM when slots defined in content of element and referenced in 
rendered shadowDOM by name. I.e. rendered DOM defines which slot and where will be displayed inside of web component.

`slotted-element` gives ability to manipulate slots programmatically without engaging shadows dom.

## API
### Attributes

# fetch-element

1. exposes [fetch() api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as web component. 
2. Input parameters and result are exposed via element attributes
3. Provides default rendering for HTML and JSON as table
4. Exposes overriding methods for fetch and render life cycle  

## API
### attributes
all attributes reflected as component properties
* `src` - url for data retrieval ( `data:` as url TBD )
* `method` - http method  
* `headers` - JS expression to be evaluated as string key-value object
* `state` - '' or one of `loading`( fetch started ), `rendering`, `loaded`, `error`
* `status` - http code response.status

NOTE: for defining the payload in http request leave `src` undefined and call `fetch(url, options)` with needed parameters

### methods
* `fetch( url, options )` - return Promise resolved upon rendering
  `abort()` - to interrupt fetch in progress. 
* `get headers()` - overrides headers key-value string pairs
* `onResponse( response )` - response from `fetch()` call. Sets `status`, `contentType`, `responseHeaders`. 
  Returns data promise from `response.json()` or ``response.text()`
* `onResult( result )` - called when data available. Renders data as HTML or table( for json contentType ).
  Sets `state="loaded"`
  
Callbacks:
* `data2Html( result, contentType, status, responseHeaders )` - override to define custom render of data into HTML string
* `onError( error )`
* `json2table( data )` - default render JSON object or array to table. Override for custom render. Return html string.
* `getKeys( obj )` - override to limit or define the order of keys on json object to be rendered in table.

## rendering by CSS
`fetch-element` could be self-sufficient without using a slots pattern: the `state` attribute is available to trigger 
visibility of internal dom subtree branches by `[state="xxx"] ...` selector. 

# test
reside in separate repository https://github.com/sashafirsov/slotted-element-test
