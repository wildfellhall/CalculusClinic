import katex from '../vendor/katex/katex.mjs';
import {escapeHTML} from './graph.mjs';

const rendered=new Map();

// Typeset only the visible content. The build checks every expression, and
// shared formulas are cached across views and question changes.
export function formatMathText(text,mathText){
  const parts=mathText[text];
  if(!parts)return escapeHTML(text);
  let skipPunctuation=0;
  return parts.map((part,i)=>{
    if(typeof part==='string'){
      const prose=part.slice(skipPunctuation);skipPunctuation=0;return escapeHTML(prose);
    }
    if(!rendered.has(part.tex))rendered.set(part.tex,katex.renderToString('\\displaystyle '+part.tex,{
      output:'htmlAndMathml',throwOnError:true,strict:'error',trust:false,
    }));
    const punctuation=typeof parts[i+1]==='string'?parts[i+1].match(/^[.,;:!?]/)?.[0]||'':'';
    skipPunctuation=punctuation.length;
    return `<span class="math-inline">${rendered.get(part.tex)}${punctuation?`<span class="math-punctuation">${escapeHTML(punctuation)}</span>`:''}</span>`;
  }).join('');
}

export function refreshMathOverflow(){
  for(const el of document.querySelectorAll('.math-inline')){
    if(el.scrollWidth>el.clientWidth+1){
      el.tabIndex=0;el.setAttribute('role','group');el.setAttribute('aria-label','Scrollable formula');
    }else{
      el.removeAttribute('tabindex');el.removeAttribute('role');el.removeAttribute('aria-label');
    }
  }
}
