import {formatMathText} from './math.mjs';

let styles;
async function dataURL(url,type){
  const response=await fetch(url);if(!response.ok)throw new Error('Report math fonts could not be loaded.');
  const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return `data:${type};base64,${btoa(binary)}`;
}
function embeddedStyles(){
  styles??=(async()=>{
    const response=await fetch('/vendor/katex/katex.min.css');if(!response.ok)throw new Error('Report math styles could not be loaded.');
    let css=await response.text();const names=[...new Set([...css.matchAll(/url\(fonts\/([^)]*\.woff2)\)/g)].map(m=>m[1]))];
    const fonts=new Map(await Promise.all(names.map(async name=>[name,await dataURL('/vendor/katex/fonts/'+name,'font/woff2')])));
    css=css.replace(/src:[^;{}]+/g,rule=>{const name=rule.match(/fonts\/([^)]*\.woff2)/)?.[1];return name?`src:url(${fonts.get(name)}) format("woff2")`:rule;});
    const body=await dataURL('/fonts/nunito.ttf','font/ttf');
    return css+`@font-face{font-family:ReportNunito;src:url(${body}) format("truetype")} .report-math{font:16px/1.7 ReportNunito,Nunito,sans-serif;color:#294637;background:#fffefa;padding:4px;box-sizing:border-box;width:720px}.report-math .math-inline{display:inline-block;vertical-align:baseline;white-space:nowrap}.report-math .katex{font-size:1.08em}.report-option{padding:5px 8px;margin:3px 0;border-radius:7px}.report-correct{background:#ddfeea}.report-math p{margin:0}`;
  })().catch(error=>{styles=null;throw error;});
  return styles;
}

// Reuse the app's KaTeX output and local fonts. Only math blocks are rasterized;
// report headings, scores, observations and attempt tables remain selectable.
export async function reportMathImages(items,mathText){
  const css=await embeddedStyles(),images=new Map(),cache=new Map(),holder=document.createElement('div');
  holder.style='position:fixed;left:-10000px;top:0;pointer-events:none;';holder.setAttribute('aria-hidden','true');document.body.append(holder);
  async function picture(html){
    if(cache.has(html))return cache.get(html);
    const root=document.createElementNS('http://www.w3.org/1999/xhtml','div');root.className='report-math';root.innerHTML=html;
    const style=document.createElementNS('http://www.w3.org/1999/xhtml','style');style.textContent=css;root.prepend(style);holder.replaceChildren(root);
    await document.fonts.ready;
    const width=Math.ceil(Math.max(720,root.scrollWidth)),height=Math.ceil(root.getBoundingClientRect().height)+4;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="${width}" height="${height}">${new XMLSerializer().serializeToString(root)}</foreignObject></svg>`;
    const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
    const canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=height*2;canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    const result={png:canvas.toDataURL('image/png'),width,height};cache.set(html,result);return result;
  }
  try{
    for(const item of items){const q=item.question,math=value=>formatMathText(value,mathText);
      images.set(q.id+'|'+q.version,{prompt:await picture(math(q.prompt)),options:await picture(q.options.map((o,i)=>`<div class="report-option ${o.id===q.correctOptionId?'report-correct':''}"><b>${String.fromCharCode(65+i)}.</b> ${math(o.text)}${o.id===q.correctOptionId?' <b>(correct)</b>':''}</div>`).join('')),explanation:await picture(math(q.explanation||''))});
    }
    return images;
  }finally{holder.remove();}
}
