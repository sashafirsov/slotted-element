import FetchElement  from './fetch-element.js';
import { CssChain as $ } from 'css-chain';

function createNode( tag, prop, val ){ const el = document.createElement(tag); el[prop]=val; return el; }

    export class
SlottedElement extends FetchElement
{
    static get observedAttributes(){ return  [ 'template', ...FetchElement.observedAttributes ]; }

    connectedCallback()
    {   this._$ = $(this);
        this.slotsInit();
        super.connectedCallback();
    }
    attributeChangedCallback( name, oldValue, newValue )
    {
        if( name !== 'template')
            return super.attributeChangedCallback( name, oldValue, newValue );
        this.template = newValue;
        this.initialized && this.slotsInit();
    }
    $( css ){ return css? this._$.$(css): this._$; }

    fetch( url, options )
    {
        this.slotOnly('loading')
        return super.fetch( url, options ).finally( ()=>this.slotOnly(this.state) );
    }

    setContent( html )
    {
        if( this.slots.loaded )
        {   const slot = this.slotClone('loaded')
            slot.innerHTML = html;
            this.slotAdd(slot);
        }else
            this.innerHTML = html;
    }


    // slot API

    slotsInit()
    {
        if( !this.slots )
        {   this.slots = {};
            this.$( '[slot]' )
                .map( node => this.slots[ node.slot ] = node );
        }
        const $i = this._$;
        if( this.template )
        {   const a = $i.attr('template');
            if( a )
                return $i.template( $('#'+a ) );

            $i.template( createNode( 'template', 'innerHTML', this.template ) );
        } else
            $i.template();
    }

    slotOnly( name )
    {   this.$( '[slot-cloned]' )
            .filter( el => el.slot !== name )
            .remove();

        if( !this.$( `[slot="${name}"][slot-cloned]` ) )
            this.slotAdd(name);
    }

    slotsClear()
    {   this.$( '[slot-cloned]' )
            .remove();
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
        ,      ref = this.$(`slot[name="${node.slot || node}"]`);
        let added;
        for( let r of ref)
            added = r.parentElement.insertBefore( slot, r );
        return added;
    }

}
export default SlottedElement;

window.customElements.define('slotted-element', SlottedElement);
