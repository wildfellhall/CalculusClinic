import {renderScratch} from './scratch-render.mjs';
import {ScratchData,SCRATCH_PREFIX,PAPER,INKS,MAX_POINTS,MAX_STROKES} from './scratch-data.mjs';

export class ScratchPad {
  constructor(storage,conceptIds){
    this.data=new ScratchData(storage,conceptIds);this.tool='pen';this.color=INKS[0];this.width=5;this.canvas=null;this.stroke=null;this.expanded=false;
    this.observer=new ResizeObserver(()=>this.paint());
  }
  markup(){return `<div class="scratch-controls" role="group" aria-label="Drawing tools"><div class="scratch-modes"><button type="button" data-scratch="pen" aria-pressed="${this.tool==='pen'}">Pen</button><button type="button" data-scratch="eraser" aria-pressed="${this.tool==='eraser'}">Eraser</button></div><div class="scratch-colors" role="group" aria-label="Ink color">${INKS.map((color,i)=>`<button type="button" data-scratch="color" data-color="${color}" style="--swatch:${color}" aria-label="${['Green','Blue','Rose'][i]} ink" aria-pressed="${this.color===color}"></button>`).join('')}</div><label class="scratch-size">Size <select id="scratch-size"><option value="3" ${this.width===3?'selected':''}>Fine</option><option value="5" ${this.width===5?'selected':''}>Medium</option><option value="9" ${this.width===9?'selected':''}>Bold</option></select></label></div><div class="scratch-actions"><button type="button" data-scratch="undo">Undo</button><button type="button" data-scratch="redo">Redo</button><button type="button" data-scratch="clear">Clear</button><button type="button" data-scratch="download">Save image</button><button type="button" data-scratch="expand" aria-pressed="${this.expanded}">${this.expanded?'Shrink':'Expand'}</button></div><div class="scratch-sheet"><canvas id="scratch-canvas" tabindex="0" aria-label="Drawing scratch pad. Use a mouse, touch, or stylus to draw. Typed notes are available below."></canvas></div><p id="scratch-status" class="scratch-status" role="status"></p>`;}
  mount(canvas,id){
    if(this.canvas===canvas&&this.id===id)return;
    this.finish();this.observer.disconnect();this.canvas=canvas;this.id=id;
    if(!canvas)return;
    this.data.page(id);this.observer.observe(canvas.parentElement);
    canvas.addEventListener('pointerdown',event=>this.start(event));
    canvas.addEventListener('pointermove',event=>this.move(event));
    for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>this.finish());
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    canvas.addEventListener('keydown',e=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();this.action(e.shiftKey?'redo':'undo');}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();this.action('redo');}
    });
    this.paint();this.update();
  }
  point(event){
    const r=this.canvas.getBoundingClientRect(),scale=Math.min(r.width/PAPER.width,r.height/PAPER.height),x=(event.clientX-r.left-(r.width-PAPER.width*scale)/2)/scale,y=(event.clientY-r.top-(r.height-PAPER.height*scale)/2)/scale;
    return [Math.round(Math.max(0,Math.min(PAPER.width,x))*10)/10,Math.round(Math.max(0,Math.min(PAPER.height,y))*10)/10];
  }
  start(event){
    if(this.stroke||!event.isPrimary||(event.button!==0&&event.button!==5))return;
    event.preventDefault();this.canvas.focus({preventScroll:true});
    const p=this.data.page(this.id);this.remaining=MAX_POINTS-p.strokes.reduce((n,s)=>n+s.points.length,0);
    if(this.remaining<1||p.strokes.length>=MAX_STROKES){this.update('This page is full. Save an image, then clear some space.');return;}
    this.pointerId=event.pointerId;const erase=this.tool==='eraser'||event.button===5;
    this.stroke={tool:erase?'eraser':'pen',color:this.color,width:erase?this.width*6:this.width,points:[this.point(event)]};
    this.canvas.setPointerCapture(event.pointerId);this.paint();
  }
  move(event){
    if(!this.stroke||event.pointerId!==this.pointerId)return;event.preventDefault();
    for(const e of event.getCoalescedEvents?.().length?event.getCoalescedEvents():[event]){
      const point=this.point(e),last=this.stroke.points.at(-1);
      if(this.stroke.points.length<this.remaining&&Math.hypot(point[0]-last[0],point[1]-last[1])>=1)this.stroke.points.push(point);
    }
    this.schedulePaint();
  }
  finish(){
    if(!this.stroke)return;
    const stroke=this.stroke,id=this.pointerId;this.stroke=null;this.pointerId=null;
    this.data.add(this.id,stroke);
    if(this.canvas?.hasPointerCapture(id))this.canvas.releasePointerCapture(id);
    this.paint();this.update();
  }
  snapshot(id){this.finish();return this.data.snapshot(id);}
  render(canvas,width,height,dpr=1){renderScratch(canvas,[...this.data.page(this.id).strokes,...(this.stroke?[this.stroke]:[])],width,height,dpr);}
  paint(){
    if(!this.canvas?.isConnected)return;
    const host=this.canvas.parentElement,scale=Math.min(host.clientWidth/PAPER.width,host.clientHeight/PAPER.height);
    if(scale>0){
      const width=PAPER.width*scale,height=PAPER.height*scale;
      this.canvas.style.width=width+'px';this.canvas.style.height=height+'px';
      this.render(this.canvas,width,height,Math.min(window.devicePixelRatio||1,2));
    }
  }
  schedulePaint(){if(this.paintQueued)return;this.paintQueued=true;requestAnimationFrame(()=>{this.paintQueued=false;this.paint();});}
  storageChanged(key){
    if(key!==null&&!key.startsWith(SCRATCH_PREFIX))return;
    const id=key?.slice(SCRATCH_PREFIX.length);
    if(key===null)this.data.pages.clear();else this.data.pages.delete(id);
    if(key===null||id===this.id){
      this.stroke=null;
      if(this.canvas?.hasPointerCapture(this.pointerId))this.canvas.releasePointerCapture(this.pointerId);
      this.pointerId=null;this.paint();this.update();
    }
  }
  update(message){
    if(!this.canvas)return;const root=this.canvas.closest('#practice-tools-root'),page=this.data.page(this.id);
    root.querySelector('#scratch-status').textContent=message||(page.saved?'Saved for this concept. A snapshot is kept when you check an answer.':'Drawing is kept here, but could not be saved. Save an image before leaving.');
    for(const action of ['undo','redo'])root.querySelector(`[data-scratch="${action}"]`).disabled=!page[action].length;
    root.querySelector('[data-scratch="clear"]').disabled=!page.strokes.length;
    for(const tool of ['pen','eraser'])root.querySelector(`[data-scratch="${tool}"]`).setAttribute('aria-pressed',String(this.tool===tool));
    for(const button of root.querySelectorAll('[data-scratch="color"]'))button.setAttribute('aria-pressed',String(button.dataset.color===this.color));
    this.canvas.style.cursor=this.tool==='eraser'?'cell':'crosshair';
  }
  action(action,color){
    this.finish();
    if(action==='pen'||action==='eraser')this.tool=action;
    if(action==='color'&&INKS.includes(color)){this.color=color;this.tool='pen';}
    if(action==='undo'||action==='redo')this.data[action](this.id);
    if(action==='clear')this.data.eraseAll(this.id);
    if(action==='expand'){
      this.expanded=!this.expanded;const root=this.canvas.closest('#practice-tools-root');root.classList.toggle('scratch-expanded',this.expanded);
      const button=root.querySelector('[data-scratch="expand"]');button.textContent=this.expanded?'Shrink':'Expand';button.setAttribute('aria-pressed',String(this.expanded));
    }
    if(action==='download'){
      const canvas=document.createElement('canvas');this.render(canvas,PAPER.width*2,PAPER.height*2);const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=`scratch-pad-${this.id}.png`;a.click();
    }
    this.paint();this.update();
  }
  clear(){this.stroke=null;this.data.clear();this.observer.disconnect();this.canvas=null;this.expanded=false;}
}
