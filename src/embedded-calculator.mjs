// Hosted calculators stay in their own origin and load only on opening.
// Keep the frame outside #app: replacing a question must not reload its graph.
export class EmbeddedCalculator {
  constructor({id,title,url,link,height=640,anchorHeight=330}){
    this.id=id;this.title=title;this.url=url;this.link=link;this.height=height;this.anchorHeight=anchorHeight;this.expanded=false;
    this.panel=null;this.slot=null;this.queued=false;
    this.observer=new ResizeObserver(()=>this.schedule());
    window.addEventListener('resize',()=>this.schedule());
    document.addEventListener('scroll',()=>this.schedule(),{capture:true,passive:true});
    window.visualViewport?.addEventListener('resize',()=>this.schedule());
  }
  create(){
    if(this.panel)return;
    this.panel=document.createElement('aside');this.panel.id=this.id+'-panel';this.panel.className='embedded-calculator '+this.id+'-panel';this.panel.setAttribute('aria-labelledby',this.id+'-title');
    this.panel.innerHTML=`<div class="practice-tool-heading"><h2 id="${this.id}-title">${this.title}</h2><div class="embedded-actions"><a href="${this.link}" target="_blank" rel="noopener noreferrer" aria-label="Open ${this.title} in a new tab">Open in tab ↗</a><button type="button" class="text-link" data-tool-action="expand-embed" data-embed="${this.id}" aria-pressed="false">Expand</button><button type="button" class="text-link" data-tool-action="close" aria-label="Close ${this.title}">Close</button></div></div><div class="embedded-frame-wrap"><p class="embedded-loading" role="status">Loading ${this.title}…</p></div><div class="embedded-footer"><span>Online calculator · kept for this visit</span><button type="button" class="text-link" data-tool-action="retry-embed" data-embed="${this.id}" hidden>Retry loading</button></div>`;
    this.frame=document.createElement('iframe');this.frame.id=this.id+'-frame';this.frame.title=this.title+' calculator';this.frame.referrerPolicy='no-referrer';
    this.frame.allow="camera 'none'; microphone 'none'; geolocation 'none'";
    this.frame.addEventListener('load',()=>{
      clearTimeout(this.timeout);
      this.panel?.querySelector('.embedded-loading')?.setAttribute('hidden','');
      this.panel?.querySelector('[data-tool-action="retry-embed"]')?.setAttribute('hidden','');
    });
    this.frame.addEventListener('error',()=>this.failed());
    this.panel.querySelector('.embedded-frame-wrap').append(this.frame);
    document.body.append(this.panel);this.load();
  }
  load(){
    clearTimeout(this.timeout);
    const status=this.panel.querySelector('.embedded-loading');status.hidden=false;status.textContent='Loading '+this.title+'…';
    this.panel.querySelector('[data-tool-action="retry-embed"]').hidden=true;
    this.frame.src=this.url;this.timeout=setTimeout(()=>this.failed(),20000);
  }
  failed(){
    if(!this.panel)return;
    const status=this.panel.querySelector('.embedded-loading');status.hidden=false;status.textContent='Taking a while to load. Retry or open it in a new tab.';
    this.panel.querySelector('[data-tool-action="retry-embed"]').hidden=false;
  }
  mount(slot,visible){
    if(this.slot!==slot){this.observer.disconnect();this.slot=slot;if(slot)this.observer.observe(slot);}
    if(!visible||!slot){if(this.panel)this.panel.hidden=true;return;}
    this.create();this.panel.hidden=false;this.position();
  }
  schedule(){if(!this.panel||this.panel.hidden||this.queued)return;this.queued=true;requestAnimationFrame(()=>{this.queued=false;this.position();});}
  position(){
    if(!this.panel||this.panel.hidden||!this.slot?.isConnected)return;
    if(this.expanded||window.matchMedia('(max-width:1100px)').matches){this.panel.removeAttribute('style');return;}
    const rect=this.slot.getBoundingClientRect(),top=Math.max(18,Math.min(rect.top,window.innerHeight-this.anchorHeight-18));
    Object.assign(this.panel.style,{left:rect.left+'px',top:top+'px',width:rect.width+'px',height:Math.min(this.height,window.innerHeight-top-18)+'px'});
  }
  expand(){
    this.expanded=!this.expanded;this.panel.classList.toggle('embedded-expanded',this.expanded);
    const button=this.panel.querySelector('[data-tool-action="expand-embed"]');button.textContent=this.expanded?'Shrink':'Expand';button.setAttribute('aria-pressed',String(this.expanded));this.position();
  }
  clear(){clearTimeout(this.timeout);this.observer.disconnect();this.panel?.remove();this.panel=null;this.frame=null;this.slot=null;this.expanded=false;}
}
