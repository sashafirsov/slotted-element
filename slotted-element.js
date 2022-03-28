import FE from './fetch-element.js';
import { CssChain as $ } from 'css-chain';

export * from './fetch-element.js';
export const FetchElement = FE;

function createNode( tag, prop, val ){ const el = document.createElement(tag); el[prop]=val; return el; }


    export class
SlottedElement extends FE
{
    static get observedAttributes(){ return  [ 'template', ...FE.observedAttributes ]; }

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
            this.$( '[slot]' ).map( node =>this.slots[ node.slot ] = node )
        }
        const $i = this._$
        ,   a = $i.attr('template');
        if( a ) $i.template( $('#'+a ) )
        else if( this.template )
            $i.template(  createNode( 'template', 'innerHTML', this.template ) )
        else
            $i.template();
        this.src || this.slotOnly('loaded');
    }

    slotOnly( name )
    {   this.$( '[slot-cloned]' )
            .filter( el => el.slot !== name )
            .remove();
        const $s = this.$().slots(name);
        $s.length && this.$().slots().attr('hidden','hidden');
        if( !this.$( `[slot="${name}"][slot-cloned]` ).length )
            this.slotAdd(name);
        this.$().slots(name).removeAttribute('hidden');
    }

    slotsClear()
    {   this.$( '[slot-cloned]' )
            .remove();
    }

    slotClone( name )
    {
        const slot = this.slots[ name ]
        if( !slot )
            return;
        const ret = slot.cloneNode( true );
        ret.setAttribute( 'slot-cloned', true );
        ret.hidden = false;
        return ret;
    }

    slotAdd( node )
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

export { $ as CssChain };
