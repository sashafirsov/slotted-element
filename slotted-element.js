import FetchElement  from './fetch-element.js';
function createNode( tag, prop, val ){ const el = document.createElement(tag); el[prop]=val; return el; }

    export class
SlottedElement extends FetchElement
{
    static get observedAttributes(){ return  [ 'template', ...FetchElement.observedAttributes ]; }

    connectedCallback()
    {   this.slotsInit();
        super.connectedCallback();
    }
    attributeChangedCallback( name, oldValue, newValue )
    {
        if( name !== 'template')
            return super.attributeChangedCallback( name, oldValue, newValue );
        if( this.template !== newValue )
        {
            this[ name ] = newValue;
        }
    }
    fetch( url, options )
    {
        this.slotOnly('loading')
        return super.fetch( url, options ).finally( ()=>this.slotOnly(this.state) );
    }

    setContent( html )
    {
        if( this.slots.loaded )
        {
            const slot = this.slotClone('loaded')
            slot.innerHTML = html;
            this.slotAdd(slot);
        }else
            this.innerHTML = html;
    }


    // slot API

    slotsInit()
    {
        if( !this.slots || this.children.length )
        {
            this.slots = {};
            for( let node of this.querySelectorAll( '[slot]' ) )
            {
                this.slots[ node.slot ] = node;
                node.parentNode.replaceChild( createNode('slot', 'name', node.slot ), node );
            }
        }

        if( this.template )
        {   const nodeContent = n => n && (n.content || n);
            let t = nodeContent(this.template.content) || nodeContent( document.getElementById( this.template ) );
            if( !t )
                t = createNode('template',"innerHTML", this.template).content;
            this.innerHTML='';
            this.appendChild( t.cloneNode(true))
        }
        for( let s of this.querySelectorAll( 'slot' ) )
        {   let slot = this.slots[ s.name ];
            if( slot )
            {   s.hidden = !0;
                s.parentNode.insertBefore( slot.cloneNode( true ), s );
            }
        }
    }

    slotOnly( name )
    {
        for( let el of this.querySelectorAll( '[slot-cloned]' ) )
            if( el.slot !== name )
                el.remove();

        if( !this.querySelector( `[slot="${name}"][slot-cloned]` ) )
            this.slotAdd(name);
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
        ,      ref = this.querySelectorAll(`slot[name="${node.slot || node}"]`);
        let added;
        for( let r of ref)
            added = r.parentElement.insertBefore( slot, r );
        return added;
    }

}
export default SlottedElement;

window.customElements.define('slotted-element', SlottedElement);
