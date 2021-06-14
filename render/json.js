import { wait4DomUpdated } from '../fetch-element.js';

export default async function render( data, contentType, status, responseHeaders )
{
    await wait4DomUpdated();
    const html = this.render( data, contentType, status, responseHeaders );
    this.setContent( html || this.json2table( data, [] ) );
    await wait4DomUpdated();
}
