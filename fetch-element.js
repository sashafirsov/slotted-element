    export function
wait4DomUpdated( cb )
{
    return new Promise( resolve =>
    {
        const assureDom = window.requestIdleCallback || window.requestAnimationFrame
            , done      = () => resolve( cb && cb() );
        assureDom ? assureDom( done ) : setTimeout( done, 100 );
    } )
}

    export function
toKebbabCase( s )
{ return ( s || '' ).toLowerCase().replaceAll( /\s/g, '-' )}

    export class
FetchElement extends HTMLElement
{
    static get observedAttributes(){ return  [ 'src', 'method', 'headers', 'state', 'status', 'error', 'skiprender' ]; }

    get headers(){ return {} }

    abort(){}

    fetch(...args){ return this._fetch(...args); }

    constructor()
    {
        super();
        let promise = Promise.resolve();
        const controller = new AbortController();
        const { signal } = controller;

        this.abort = () => controller.abort();
        this._fetch = async( url, options ) =>
        {
            this.state = 'loading';
            this.status = '';

            const opt = {
                method: this.getAttribute( 'method' ) || 'GET'
                , headers: this.headers
                , ...options
                , signal
            };

            return promise = new Promise( async( resolve, reject ) =>
            {
                try
                {   const response = await fetch( url, opt );
                    const ret = await this.onResponse( response )
                    const res = await this.onResult( ret );
                    this.error ? reject( this.error ) : resolve( res );
                }catch( ex )
                { reject( this.onError( ex ) ); }
            } )
        };
        Object.defineProperty( this, 'promise', { get(){ return promise; } } );
        FetchElement.observedAttributes
            .filter( prop => prop !== 'headers' )
            .forEach( prop => Object.defineProperty( this, prop,
                {
                    get: () => this.getAttribute( prop )
                    , set: val => this.setAttribute( prop, val )
                } ) );
    }

    attributeChangedCallback( name, oldValue, newValue )
    {
        switch( name )
        {   case 'headers':
                this[ name ] = eval( newValue );
                break;
            case 'src':
                this.fetch( newValue );
                break;
            default:
                if( this[ name ] !== newValue )
                    this[ name ] = newValue;
        }
    }

    async onResponse( response )
    {
        const s = 1 * ( this.status = response.status );
        if( s < 200 || s >= 300 )
            this.error = 'network error';
        this.contentType = response.headers.get( 'content-type' );
        this.responseHeaders = response.headers;
        if( this.contentType.includes( 'json' ) )
            return response.json();
        return response.text();
    }

    setContent( html ){ this.innerHTML = html; }
    
    async onResult( result )
    {
        try
        {   if( this.hasAttribute('skiprender') )
                return;
            this.state = 'rendering';

            if( this.contentType.includes( 'xml' ) )
            {
                const xml = ( new window.DOMParser() ).parseFromString( result, "text/xml" );
                this.render( xml, this.contentType, this.status, this.responseHeaders );
                // todo xslt from xml
            }else if( this.contentType.includes( 'html' ) )
            {
                this.setContent(result);
                await wait4DomUpdated();
                this.render( result, this.contentType, this.status, this.responseHeaders );
                await wait4DomUpdated();
            }else if( this.contentType.includes( 'json' ) )
            {
                await wait4DomUpdated();
                const html = this.render( result, this.contentType, this.status, this.responseHeaders );
                this.setContent( html || this.json2table( result, [] ) );
                await wait4DomUpdated();
            }
        }finally
        {
            this.state = 'loaded';
        }
    }

    render( data, contentType, httpCode, responseHeaders ){}

    onError( error )
    {
        this.state = 'error';
        return error;
    }

    getKeys( obj ){ return Object.keys( obj ); }

    json2table( data, path )
    {
        if( Array.isArray( data ) )
        {
            if( !data.length )
                return '';
            const keys = this.getKeys( data[ 0 ] );

            return `
<table>
    <tr>${ keys.map( k => `<th>${ k }</th>` ).join( '\n' ) }</tr>
    ${ data.map( ( r, i ) => `
    <tr>${ keys.map( k => `
        <td key="${ toKebbabCase( k ) }">
            ${ this.json2table( r[ k ], [ ...path, i, k ] ) }
        </td>` ).join( '' )
            }
    </tr>` ).join( '\n' ) }
</table>
`
        }
        if( typeof data !== 'object' || data === null )
            return data;
        const keys = this.getKeys( data );
        return `
<table>
    ${ keys.map( k => `
<tr><th>${ k }</th>
    <td key="${ toKebbabCase( k ) }">${ this.json2table( data[ k ], [ ...path, k ] ) }</td>
</tr>` ).join( '' ) }
</table>
`
    }

}

export default FetchElement;

window.customElements.define( 'fetch-element', FetchElement );
