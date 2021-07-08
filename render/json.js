import { toKebbabCase, wait4DomUpdated } from '../fetch-element.js';

export default async function render( data, contentType, status, responseHeaders )
{
    await wait4DomUpdated();
    const html = this.render( data, contentType, status, responseHeaders );
    if( !this.json2table )
        this.json2table = json2table;
    this.setContent( html || this.json2table( data, [] ) );
    await wait4DomUpdated();
}
export function json2table( data, path )
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
