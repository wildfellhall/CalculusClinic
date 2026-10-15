import {calculate,formatResult,EXPRESSION_LIMIT} from './calculator.mjs';
import {PracticeNotes,NOTES_KEY,NOTE_LIMIT} from './practice-notes.mjs';
import {escapeHTML as esc} from './graph.mjs';

export class PracticeTools {
  constructor(storage,conceptIds){
    this.notes=new PracticeNotes(storage,conceptIds);this.active=null;this.conceptId=null;this.expression='';this.angle='rad';this.answer=null;this.result=null;this.error='';this.undoNote=null;
    document.addEventListener('click',e=>this.click(e));
    document.addEventListener('input',e=>{
      if(e.target.id==='calculator-expression'){this.expression=e.target.value;this.result=null;this.error='';this.updateResult();}
      if(e.target.id==='practice-notepad'){this.notes.set(this.conceptId,e.target.value);this.undoNote=null;this.updateNoteStatus();}
    });
    document.addEventListener('change',e=>{
      if(e.target.id==='calculator-angle'){this.angle=e.target.value;this.result=null;this.error='';this.updateResult();}
    });
    document.addEventListener('submit',e=>{if(e.target.id==='calculator-form'){e.preventDefault();this.evaluate();}});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&e.target.closest('#practice-tools-root')){e.preventDefault();this.close();}
    });
    window.addEventListener('storage',e=>{
      if(e.key===NOTES_KEY||e.key===null){this.notes.load();this.undoNote=null;const input=document.querySelector('#practice-notepad');if(input)input.value=this.notes.get(this.conceptId);this.updateNoteStatus();}
    });
  }
  toolbar(){return `<div class="practice-tool-launcher" aria-label="Practice tools">${['calculator','notepad'].map(tool=>`<button type="button" id="open-${tool}" class="button compact" data-tool-action="toggle" data-tool="${tool}" aria-expanded="${this.active===tool}" aria-controls="practice-tools-root">${tool==='calculator'?'Calculator':'Notepad'}</button>`).join('')}</div>`;}
  markup(conceptId){
    if(this.conceptId!==conceptId){this.conceptId=conceptId;this.undoNote=null;}
    return `<aside id="practice-tools-root" class="practice-tools" aria-label="Practice tools" ${this.active?'':'hidden'}>${this.panel()}</aside>`;
  }
  panel(){
    if(!this.active)return '';
    const header=`<div class="practice-tool-heading"><h2 id="practice-tool-title">${this.active==='calculator'?'Calculator':'Notepad'}</h2><button type="button" class="text-link" data-tool-action="close" aria-label="Close ${this.active}">Close</button></div>`;
    return header+(this.active==='calculator'?this.calculator():this.notepad());
  }
  calculator(){
    const keys=[['(', '('],[')', ')'],['^','Power'],['/','Divide'],['7','7'],['8','8'],['9','9'],['*','Multiply'],['4','4'],['5','5'],['6','6'],['-','Subtract'],['1','1'],['2','2'],['3','3'],['+','Add'],['0','0'],['.','Decimal point'],['ans','Previous answer'],['=','Calculate']];
    const label=key=>({'*':'×','/':'÷','-':'−','ans':'Ans'}[key]||key);
    return `<form id="calculator-form" class="calculator-form" aria-labelledby="practice-tool-title">
      <label class="sr-only" for="calculator-expression">Calculator expression</label><input id="calculator-expression" type="text" value="${esc(this.expression)}" maxlength="${EXPRESSION_LIMIT}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. (3 + 5) / 2" aria-describedby="calculator-result">
      <output id="calculator-result" for="calculator-expression calculator-angle" aria-live="polite" ${this.error?'class="calculator-error"':''}>${esc(this.error|| (this.result===null?'Enter an expression':formatResult(this.result.value)))}</output>
      <div class="calculator-options"><label for="calculator-angle" class="sr-only">Angle unit</label><select id="calculator-angle"><option value="rad" ${this.angle==='rad'?'selected':''}>Radians</option><option value="deg" ${this.angle==='deg'?'selected':''}>Degrees</option></select><button type="button" data-tool-action="clear-calculator">Clear</button><button type="button" data-tool-action="backspace" aria-label="Delete last character">⌫</button></div>
      <div class="calculator-keys">${keys.map(([key,aria])=>`<button ${key==='='?'type="submit" class="calculator-equals"':`type="button" data-tool-action="insert" data-value="${key}"`} aria-label="${aria}">${label(key)}</button>`).join('')}</div>
      <details class="calculator-scientific"><summary>Scientific functions</summary><div class="calculator-functions">${['sqrt(','sin(','cos(','tan(','asin(','acos(','atan(','ln(','log(','abs(','π','e','!','%'].map(value=>`<button type="button" data-tool-action="insert" data-value="${value}" aria-label="${value==='sqrt('?'Square root':value==='!'?'Factorial':value==='%'?'Percent':value.replace('(','')}">${value==='sqrt('?'√':value.replace('(','')}</button>`).join('')}</div><p>log is base 10; ln is base e. Use parentheses for functions and ^ for powers.</p></details>
      <button type="button" id="calculator-to-notes" class="text-link" data-tool-action="result-to-notes" ${this.result===null?'disabled':''}>Add result to notes</button>
    </form>`;
  }
  notepad(){return `<label for="practice-notepad" class="notepad-label">Working notes · ${esc(this.conceptId)}</label><textarea id="practice-notepad" rows="8" maxlength="${NOTE_LIMIT}" spellcheck="false" placeholder="Work through a step, keep a formula, or jot down a question…" aria-describedby="notepad-status">${esc(this.notes.get(this.conceptId))}</textarea><div class="notepad-footer"><span id="notepad-status" role="status">${this.noteStatus()}</span><button type="button" class="text-link" id="notepad-clear" data-tool-action="clear-notes">${this.undoNote===null?'Clear':'Undo clear'}</button></div>`;}
  noteStatus(){return this.notes.saved?'Saved for this concept in this browser.':'Not saved to this browser. Keep a copy before closing.';}
  updateNoteStatus(){
    const status=document.querySelector('#notepad-status');if(status)status.textContent=this.noteStatus();
    const button=document.querySelector('#notepad-clear');if(button)button.textContent=this.undoNote===null?'Clear':'Undo clear';
  }
  mount(){
    const root=document.querySelector('#practice-tools-root');
    document.querySelector('.practice-page')?.classList.toggle('with-tools',!!root&&!!this.active);
    document.querySelector('.practice-workspace')?.classList.toggle('has-tools',!!this.active);
  }
  refresh(focus=false){
    const root=document.querySelector('#practice-tools-root');if(!root)return;
    root.hidden=!this.active;root.innerHTML=this.panel();this.mount();
    for(const tool of ['calculator','notepad'])document.querySelector('#open-'+tool)?.setAttribute('aria-expanded',String(this.active===tool));
    if(focus){
      document.querySelector(this.active==='calculator'?'#calculator-expression':'#practice-notepad')?.focus({preventScroll:true});
      // Leave the problem in view above the compact tool drawer on phones.
      if(window.matchMedia('(max-width:950px)').matches)document.querySelector('#question-title')?.scrollIntoView({block:'start'});
    }
  }
  close(){const previous=this.active;this.active=null;this.refresh();document.querySelector('#open-'+previous)?.focus({preventScroll:true});}
  updateResult(){
    const output=document.querySelector('#calculator-result');if(!output)return;
    output.textContent=this.error||(this.result===null?'Enter an expression':formatResult(this.result.value));output.classList.toggle('calculator-error',!!this.error);
    document.querySelector('#calculator-to-notes').disabled=this.result===null;
  }
  evaluate(){
    try{const value=calculate(this.expression,{angle:this.angle,ans:this.answer});this.result={value,expression:this.expression,angle:this.angle};this.answer=value;this.error='';}
    catch(error){this.error=error.message;this.result=null;}
    this.updateResult();
  }
  insert(value,{backspace=false}={}){
    const input=document.querySelector('#calculator-expression');if(!input)return;
    let start=input.selectionStart??input.value.length,end=input.selectionEnd??start;
    if(backspace&&start===end)start=Math.max(0,start-1);
    if(input.value.length-(end-start)+value.length>EXPRESSION_LIMIT)return;
    input.setRangeText(value,start,end,'end');this.expression=input.value;this.result=null;this.error='';this.updateResult();input.focus({preventScroll:true});
  }
  click(event){
    const button=event.target.closest('[data-tool-action]');if(!button||button.disabled)return;
    const action=button.dataset.toolAction;
    if(action==='toggle'){if(this.active===button.dataset.tool)this.close();else{this.active=button.dataset.tool;this.refresh(true);}return;}
    if(action==='close'){this.close();return;}
    if(action==='insert'){this.insert(button.dataset.value);return;}
    if(action==='backspace'){this.insert('',{backspace:true});return;}
    if(action==='clear-calculator'){this.expression='';this.result=null;this.answer=null;this.error='';this.refresh(true);return;}
    if(action==='clear-notes'){
      const previous=this.notes.get(this.conceptId),next=this.undoNote??'';this.undoNote=this.undoNote===null?previous:null;this.notes.set(this.conceptId,next);
      document.querySelector('#practice-notepad').value=next;this.updateNoteStatus();return;
    }
    if(action==='result-to-notes'&&this.result){
      const old=this.notes.get(this.conceptId),result=this.result,line=`${result.expression} = ${formatResult(result.value)} (${result.angle==='rad'?'radians':'degrees'})`;
      const next=old+(old?'\n':'')+line;
      if(next.length>NOTE_LIMIT){this.error='The notepad is full. Clear some space before adding this result.';this.updateResult();return;}
      this.notes.set(this.conceptId,next);this.undoNote=null;this.active='notepad';this.refresh(true);
    }
  }
  clear(){this.notes.clear();this.active=null;this.expression='';this.result=null;this.answer=null;this.error='';this.undoNote=null;}
}
