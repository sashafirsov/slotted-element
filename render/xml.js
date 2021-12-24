export default async function render( data, contentType, status, responseHeaders )
{
    const xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    this.render( xml, contentType, status, responseHeaders );
    // todo xslt from xml
}
    export function
getXml(url, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onreadystatechange = function ()
    {
        if( 4 != xhr.readyState )
            return;
        try
        {   if( xhr.responseXML )
                return callback(xhr.responseXML);
            var txt = xhr.responseText.trim();
            if( txt.charAt(0)!='<' )
                txt = Json2Xml( JSON.parse(txt) );
            callback(new DOMParser().parseFromString( txt, "application/xml" ));
        }catch( ex )
            {   console.error("XML reading error", ex ); }
    }
    xhr.send();
}
    export function
Json2Xml( o, tag )
{   var noTag = "string" != typeof tag;

    if( o instanceof Array )
    {   noTag &&  (tag = 'array');
        return "<"+tag+">"+o.map(function(el){ return Json2Xml(el,tag); }).join()+"</"+tag+">";
    }
    noTag &&  (tag = 'r');
    tag=tag.replace( /[^a-z0-9]/gi,'_' );
    var oo  = {}
        ,   ret = [ "<"+tag+" "];
    for( var k in o )
        if( typeof o[k] == "object" )
            oo[k] = o[k];
        else
            ret.push( k.replace( /[^a-z0-9]/gi,'_' ) + '="'+o[k].toString().replace(/&/gi,'&#38;')+'"');
    if( oo )
    {   ret.push(">");
        for( var k in oo )
            ret.push( Json2Xml( oo[k], k ) );
        ret.push("</"+tag+">");
    }else
        ret.push("/>");
    return ret.join('\n');
}