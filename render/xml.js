export default async function render( data, contentType, status, responseHeaders )
{
    const xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    this.render( xml, contentType, status, responseHeaders );
    // todo xslt from xml
}
