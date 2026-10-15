import {PracticeNotes,NOTES_KEY,NOTE_LIMIT} from './practice-notes.mjs';
import {escapeHTML as esc} from './graph.mjs';
import {DesmosTool} from './desmos-tool.mjs';
import {EmbeddedCalculator} from './embedded-calculator.mjs';
import {ScratchPad} from './scratch-pad.mjs';

const toolLabels={calculator:'Calculator',desmos:'Desmos',notepad:'Scratch pad'};
export class PracticeTools {
  constructor(storage,conceptIds){
    this.notes=new PracticeNotes(storage,conceptIds);this.scratch=new ScratchPad(storage,conceptIds);this.active=null;this.conceptId=null;this.undoNote=null;
    this.desmos=new DesmosTool();
    this.scientific=new EmbeddedCalculator({id:'scientific',title:'NumWorks',url:'https://www.numworks.com/simulator/embed/',link:'https://www.numworks.com/simulator/',height:760});
    document.addEventListener('click',e=>this.click(e));
    document.addEventListener('input',e=>{
      if(e.target.id==='practice-notepad'){this.notes.set(this.conceptId,e.target.value);this.undoNote=null;this.updateNoteStatus();}
    });
    document.addEventListener('change',e=>{if(e.target.id==='scratch-size')this.scratch.width=Number(e.target.value);});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&e.target.closest('#practice-tools-root, .embedded-calculator')){
        e.preventDefault();
        if(this.active==='notepad'&&this.scratch.expanded)this.scratch.action('expand');
        else this.close();
      }
    });
    window.addEventListener('storage',e=>{
      this.scratch.storageChanged(e.key);
      if(e.key===NOTES_KEY||e.key===null){this.notes.load();this.undoNote=null;const input=document.querySelector('#practice-notepad');if(input)input.value=this.notes.get(this.conceptId);this.updateNoteStatus();}
    });
  }
  embed(){return this.active==='desmos'?this.desmos:this.active==='calculator'?this.scientific:null;}
  toolbar(){return `<div class="practice-tool-launcher" aria-label="Practice tools">${Object.entries(toolLabels).map(([tool,label])=>`<button type="button" id="open-${tool}" class="button compact" data-tool-action="toggle" data-tool="${tool}" aria-expanded="${this.active===tool}" aria-controls="${tool==='desmos'?'desmos-panel':tool==='calculator'?'scientific-panel':'practice-tools-root'}">${label}</button>`).join('')}</div>`;}
  markup(conceptId){
    if(this.conceptId!==conceptId){this.conceptId=conceptId;this.undoNote=null;}
    return `<aside id="practice-tools-root" class="practice-tools" aria-label="Practice tools" ${this.active?'':'hidden'}>${this.panel()}</aside>`;
  }
  panel(){
    if(this.active!=='notepad')return '';
    return `<div class="practice-tool-heading"><h2 id="practice-tool-title">Scratch pad</h2><button type="button" class="text-link" data-tool-action="close" aria-label="Close scratch pad">Close</button></div>${this.scratch.markup()}<details class="scratch-typed"><summary>Typed notes</summary><label class="sr-only" for="practice-notepad">Working notes for this concept</label><textarea id="practice-notepad" rows="4" maxlength="${NOTE_LIMIT}" spellcheck="false" placeholder="Add a formula or a reminder…" aria-describedby="notepad-status">${esc(this.notes.get(this.conceptId))}</textarea><div class="notepad-footer"><span id="notepad-status" role="status">${this.noteStatus()}</span><button type="button" class="text-link" id="notepad-clear" data-tool-action="clear-notes">${this.undoNote===null?'Clear notes':'Undo clear'}</button></div></details>`;
  }
  noteStatus(){return this.notes.saved?'Saved for this concept.':'Not saved to this browser. Keep a copy before closing.';}
  updateNoteStatus(){
    const status=document.querySelector('#notepad-status');if(status)status.textContent=this.noteStatus();
    const button=document.querySelector('#notepad-clear');if(button)button.textContent=this.undoNote===null?'Clear notes':'Undo clear';
  }
  mount(){
    const root=document.querySelector('#practice-tools-root'),embed=this.embed();
    document.querySelector('.practice-page')?.classList.toggle('with-tools',!!root&&!!this.active);
    document.querySelector('.practice-workspace')?.classList.toggle('has-tools',!!this.active);
    for(const name of ['desmos','calculator','scratch']){
      const selected=this.active===(name==='scratch'?'notepad':name);
      document.querySelector('.practice-page')?.classList.toggle('with-'+name,!!root&&selected);
      document.querySelector('.practice-workspace')?.classList.toggle('has-'+name,selected);
    }
    root?.classList.toggle('embedded-slot',!!embed);
    root?.classList.toggle('scratch-expanded',this.active==='notepad'&&this.scratch.expanded);
    this.scratch.mount(document.querySelector('#scratch-canvas'),this.conceptId);
    this.desmos.mount(root,!!root&&this.active==='desmos');
    this.scientific.mount(root,!!root&&this.active==='calculator');
  }
  refresh(focus=false){
    const root=document.querySelector('#practice-tools-root');if(!root)return;
    this.scratch.finish();root.hidden=!this.active;root.innerHTML=this.panel();this.mount();
    for(const tool of Object.keys(toolLabels))document.querySelector('#open-'+tool)?.setAttribute('aria-expanded',String(this.active===tool));
    if(focus){
      document.querySelector(this.embed()?'#'+this.embed().id+'-frame':'#scratch-canvas')?.focus({preventScroll:true});
      if(window.matchMedia('(max-width:1100px)').matches)document.querySelector('#question-title')?.scrollIntoView({block:'start'});
    }
  }
  close(){const previous=this.active;this.active=null;this.refresh();document.querySelector('#open-'+previous)?.focus({preventScroll:true});}
  click(event){
    const drawing=event.target.closest('[data-scratch]');if(drawing&&!drawing.disabled){this.scratch.action(drawing.dataset.scratch,drawing.dataset.color);return;}
    const button=event.target.closest('[data-tool-action]');if(!button||button.disabled)return;
    const action=button.dataset.toolAction;
    if(action==='toggle'){if(this.active===button.dataset.tool)this.close();else{this.active=button.dataset.tool;this.refresh(true);}return;}
    if(action==='close'){this.close();return;}
    if(action==='retry-embed'){this[button.dataset.embed]?.load();return;}
    if(action==='expand-embed'){this[button.dataset.embed]?.expand();return;}
    if(action==='clear-notes'){
      const previous=this.notes.get(this.conceptId),next=this.undoNote??'';this.undoNote=this.undoNote===null?previous:null;this.notes.set(this.conceptId,next);
      document.querySelector('#practice-notepad').value=next;this.updateNoteStatus();
    }
  }
  clear(){this.scratch.clear();this.notes.clear();this.desmos.clear();this.scientific.clear();this.active=null;this.undoNote=null;}
}
