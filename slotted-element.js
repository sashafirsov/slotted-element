import FetchElement from './fetch-element.js';
    export class
SlottedElement extends FetchElement
{
    constructor()
    {   super();
        this.slotsInit();
    }
    connectedCallback()
    {

    }

    fetch( url, options )
    {
        this.slotOnly('loading')
        return super.fetch( url, options ).finally( ()=>this.slotOnly(this.state) );
    }

    // onError( error ){ this.slotAdd('error'); }

    // slot API

    slotsInit()
    {
        this.slots = {};
        for( let slot of this.querySelectorAll( '[slot]' ) )
            this.slots[ slot.slot ] = slot;
    }

    slotOnly( name ){ this.slotsClear(); this.slotAdd(name); }

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
