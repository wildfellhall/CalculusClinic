// Desmos' hosted calculator stays in its own origin and loads only on opening.
// Keep the frame outside #app: replacing a question must not reload its graph.
// The full calculator URL exposes expression editing; ?embed is graph-only.
export const DESMOS_EMBED_URL='https://www.desmos.com/calculator';
export class DesmosTool {
  constructor(){
    this.panel=null;this.slot=null;this.queued=false;
    this.observer=new ResizeObserver(()=>this.schedule());
    window.addEventListener('resize',()=>this.schedule());
    document.addEventListener('scroll',()=>this.schedule(),{capture:true,passive:true});
    window.visualViewport?.addEventListener('resize',()=>this.schedule());
  }
  create(){
    if(this.panel)return;
    this.panel=document.createElement('aside');this.panel.id='desmos-panel';this.panel.className='desmos-panel';this.panel.setAttribute('aria-labelledby','desmos-title');
    this.panel.innerHTML=`<div class="practice-tool-heading"><h2 id="desmos-title">Desmos</h2><div class="desmos-actions"><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer" aria-label="Open Desmos in a new tab">Open in tab ↗</a><button type="button" class="text-link" data-tool-action="close" aria-label="Close Desmos">Close</button></div></div><div class="desmos-frame-wrap"><p class="desmos-loading" role="status">Loading Desmos…</p></div><div class="desmos-footer"><span>Online graphing · kept for this visit</span><button type="button" class="text-link" data-tool-action="retry-desmos" hidden>Retry loading</button></div>`;
    this.frame=document.createElement('iframe');this.frame.id='desmos-frame';this.frame.title='Desmos graphing calculator';this.frame.referrerPolicy='no-referrer';
    this.frame.allow="camera 'none'; microphone 'none'; geolocation 'none'";
    this.frame.addEventListener('load',()=>{
      clearTimeout(this.timeout);
      this.panel?.querySelector('.desmos-loading')?.setAttribute('hidden','');
      this.panel?.querySelector('[data-tool-action="retry-desmos"]')?.setAttribute('hidden','');
    });
    this.frame.addEventListener('error',()=>this.failed());
    this.panel.querySelector('.desmos-frame-wrap').append(this.frame);
    document.body.append(this.panel);this.load();
  }
  load(){
    clearTimeout(this.timeout);
    const status=this.panel.querySelector('.desmos-loading');status.hidden=false;status.textContent='Loading Desmos…';
    this.panel.querySelector('[data-tool-action="retry-desmos"]').hidden=true;
    this.frame.src=DESMOS_EMBED_URL;this.timeout=setTimeout(()=>this.failed(),20000);
  }
  failed(){
    if(!this.panel)return;
    const status=this.panel.querySelector('.desmos-loading');status.hidden=false;status.textContent='Desmos is taking a while to load. Check your connection, retry, or open it in a new tab.';
    this.panel.querySelector('[data-tool-action="retry-desmos"]').hidden=false;
  }
  mount(slot,visible){
    if(this.slot!==slot){this.observer.disconnect();this.slot=slot;if(slot)this.observer.observe(slot);}
    if(!visible||!slot){if(this.panel)this.panel.hidden=true;return;}
    this.create();this.panel.hidden=false;this.position();
  }
  schedule(){if(!this.panel||this.panel.hidden||this.queued)return;this.queued=true;requestAnimationFrame(()=>{this.queued=false;this.position();});}
  position(){
    if(!this.panel||this.panel.hidden||!this.slot?.isConnected)return;
    if(window.matchMedia('(max-width:1100px)').matches){this.panel.removeAttribute('style');return;}
    const rect=this.slot.getBoundingClientRect(),top=Math.max(18,Math.min(rect.top,window.innerHeight-330));
    Object.assign(this.panel.style,{left:rect.left+'px',top:top+'px',width:rect.width+'px',height:Math.min(640,window.innerHeight-top-18)+'px'});
  }
  clear(){clearTimeout(this.timeout);this.observer.disconnect();this.panel?.remove();this.panel=null;this.frame=null;this.slot=null;}
}
