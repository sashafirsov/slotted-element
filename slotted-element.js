    export class
SlottedElement extends HTMLElement
{

    static get observedAttributes(){ return [ 'src', 'method', 'headers' ]; }

    connectedCallback()
    {
        this.slotsInit();
    }

    fetch( url, options )
    {
        this.slotsClear();
        this.slotAdd('loading');
        const opt = {   method  : this.getAttribute( 'method' ) || 'GET'
            ,   headers : this.headers
            ,   ...options
        };

        return fetch( url, opt )
            .then( response => this.onResponse( response ) )
            .then( result => this.onResult( result ) )
            .catch( error => this.onError( error ) );
    }

    get headers(){ return {} }

    onResponse( response )
    {
        this.contentType = response.headers.get( 'content-type' );
        if( this.contentType.includes( 'json' ) )
            return response.json();
        return response.text();
    }

    onResult( result )
    {
        if( this.contentType.includes( 'xml' ) )
        {
            ( new window.DOMParser() ).parseFromString( result, "text/xml" );
            // todo xslt from xml
        }else if( this.contentType.includes( 'html' ) )
        {
            this.innerHTML = result;
            // todo evaluate scripts
        }else if( this.contentType.includes( 'json' ) )
        {

        }
        this.slotAdd( 'done' );
    }

    onError( error ){ this.slotAdd('error'); }

    attributeChangedCallback( name, oldValue, newValue )
    {
        console.log( 'attributeChangedCallback', name, oldValue, newValue );

        this[ name ] = newValue;
        switch( name )
        {
            case 'headers':
                this[ name ] = eval( newValue );
                break;
            case 'src':
                setTimeout( () => this.fetch( newValue ) )
                break;
        }
    }

    // slot API

    slotsInit()
    {
        this.slots = {};
        for( let slot of this.querySelectorAll( '[slot]' ) )
            this.slots[ slot.slot ] = slot;
    }

    slotsClear()
    {
        for( let slot of this.querySelectorAll( '[slot-cloned]' ) )
            slot.remove();
    }

    slotClone( name )// create slot to be modified before by slotAdd(node)
    {
        const slot = this.slots[ name ]
        if( !slot )
            return;
        const ret = slot.cloneNode( true );
        ret.setAttribute( 'slot-cloned', true );
        ret.hidden = false;
        return ret;
    }

    slotAdd( node ) // name or node created by slotClone(name)
    {
        const slot = node.slot ? node: this.slotClone( node )
            ,      ref = this.slots[ node.slot ];
        return ref && ref.parentElement.insertBefore( slot, ref );
    }

}

window.customElements.define('slotted-element', SlottedElement);
