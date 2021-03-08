import FetchElement  from './fetch-element.js';
    export class
SlottedElement extends FetchElement
{
    static get template()
    {   return `
<div slot="loading">loading...</div>
<div slot="error">System error</div>
<div slot="loaded"></div>
`   }

    constructor()
    {   super();
        this.slotsInit();
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
        this.slots = {};
        for( let slot of this.querySelectorAll( '[slot]' ) )
            this.slots[ slot.slot ] = slot;
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
        ,      ref = this.slots[ node.slot || node ];
        return ref && ref.parentElement.insertBefore( slot, ref );
    }

}

window.customElements.define('slotted-element', SlottedElement);
