import {topologicalOrder} from './core.mjs';
import {DIAGNOSTIC_LABELS} from './diagnostic.mjs';
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wrap=(str,max=25)=>{const lines=[''];for(const word of str.split(' ')){if((lines.at(-1)+' '+word).trim().length>max&&lines.at(-1))lines.push(word);else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();}return lines;};
export const MASTERY_SCALE=['#F3FEF5','#DDFEEA','#B9E2C7','#94CBA8','#80BA95'];
export const UNPRACTICED_FILL='#fffefa';
export function masteryFill(score){
  if(score===null||!Number.isFinite(score))return UNPRACTICED_FILL;
  const position=Math.max(0,Math.min(1,score))*(MASTERY_SCALE.length-1),index=Math.min(Math.floor(position),MASTERY_SCALE.length-2),fraction=position-index;
  const rgb=color=>color.match(/[\da-f]{2}/gi).map(x=>parseInt(x,16));
  const a=rgb(MASTERY_SCALE[index]),b=rgb(MASTERY_SCALE[index+1]);
  return '#'+a.map((n,i)=>Math.round(n+(b[i]-n)*fraction).toString(16).padStart(2,'0')).join('');
}
export function masteryDescription(s){
  return s?.masteryScore==null?'Not tried':`Practice mastery ${Math.round(s.masteryScore*100)}%. ${s.latestCorrect} of ${s.available} latest answers correct; ${s.attempted} of ${s.available} questions tried.${s.timingAdjustment>0?' Includes a small response-time adjustment.':''}`;
}
const cardHeight=(c,width)=>Math.max(124,wrap(c.title,width<200?21:25).length*16+81);
export function graphLayout(nodes,relationships,{focus=null,compact=false}={}){
  if(!nodes.length)return {nodes:[],edges:[],width:600,height:400};
  const ids=new Set(nodes.map(c=>c.id)), edges=relationships.filter(e=>ids.has(e.source)&&ids.has(e.target));
  const prereq=edges.filter(e=>e.type==='prerequisite');
  const ranks=new Map();
  if(focus){
    const before=new Set(prereq.filter(e=>e.target===focus).map(e=>e.source));
    for(const n of nodes)ranks.set(n.id,n.id===focus?1:before.has(n.id)?0:2);
  }else{
    for(const id of topologicalOrder(nodes,prereq)){const incoming=prereq.filter(e=>e.target===id);ranks.set(id,incoming.length?Math.max(...incoming.map(e=>ranks.get(e.source)+1)):0);}
  }
  const columns=new Map();
  for(const n of nodes){const rank=ranks.get(n.id);if(!columns.has(rank))columns.set(rank,[]);columns.get(rank).push(n);}
  if(focus&&compact){
    let y=24;const positioned=[];
    for(const rank of [...columns.keys()].sort((a,b)=>a-b)){
      const group=columns.get(rank).sort((a,b)=>a.unit-b.unit||a.id.localeCompare(b.id,undefined,{numeric:true}));
      for(let i=0;i<group.length;i+=2){
        const row=group.slice(i,i+2),height=Math.max(...row.map(c=>cardHeight(c,160)));
        row.forEach((c,j)=>positioned.push({...c,x:group.length===1?98:12+j*182,y,w:160,h:height}));
        y+=height+24;
      }
      y+=28;
    }
    return {nodes:positioned,edges,width:366,height:y-30,direction:'vertical'};
  }
  const columnHeight=group=>group.reduce((sum,c)=>sum+cardHeight(c,204)+28,0);
  const height=Math.max(350,...[...columns.values()].map(group=>columnHeight(group)+76)), positioned=[];
  for(const [rank,group] of columns){
    group.sort((a,b)=>a.unit-b.unit||a.id.localeCompare(b.id,undefined,{numeric:true}));
    let y=(height-columnHeight(group))/2;
    group.forEach(c=>{const h=cardHeight(c,204);positioned.push({...c,x:32+rank*274,y,w:204,h});y+=h+28;});
  }
  return {nodes:positioned,edges,width:Math.max(...ranks.values())*274+270,height};
}
export function drawGraph(layout,units,{selected=null,standalone=false,title='Calculus Clinic · Concept dependencies',progress=null,recommended=null}={}){
  const byId=new Map(layout.nodes.map(n=>[n.id,n]));
  const paths=layout.edges.map((e,i)=>{
    const a=byId.get(e.source),b=byId.get(e.target),forward=b.x>a.x;
    const x1=a.x+(forward?a.w:a.w/2),y1=a.y+(forward?a.h/2:a.h),x2=b.x+(forward?0:b.w/2),y2=b.y+(forward?b.h/2:0);
    const d=layout.direction==='vertical'&&b.y>a.y?`M${a.x+a.w/2},${a.y+a.h} C${a.x+a.w/2},${a.y+a.h+28} ${b.x+b.w/2},${b.y-28} ${b.x+b.w/2},${b.y-7}`:forward?`M${x1},${y1} C${x1+40},${y1} ${x2-40},${y2} ${x2-7},${y2}`:`M${x1},${y1} C${x1+48},${y1+35} ${x2+48},${y2-35} ${x2},${y2-7}`;
    const relation=e.type!=='prerequisite';
    return `<path class="edge ${relation?'relation':''}" d="${d}" fill="none" stroke="${relation?'#9985bb':'#92b9a5'}" stroke-width="1.7" ${relation?'stroke-dasharray="5 5"':''} marker-end="url(#${relation?'relationArrow':'arrow'})"><title>${escapeHTML(`${e.source} → ${e.target}: ${e.type}. ${e.rationale}`)}</title></path>`;
  }).join('');
  const cards=layout.nodes.map(n=>{
    const fill=units.find(u=>u.id===n.unit).color,active=n.id===selected,lines=wrap(n.title,n.w<200?21:25),s=progress?.get(n.id),score=s?.masteryScore??null,next=n.id===recommended;
    const description=progress?masteryDescription(s)+(s?.status?' '+DIAGNOSTIC_LABELS[s.status]+'.':'')+(next?' Recommended next check.':''):'',label=score===null?'Not tried':`${Math.round(score*100)}% · ${s.attempted}/${s.available} tried`;
    return `<g class="graph-node${active?' selected':''}${next?' recommended':''}" data-recommended="${next}" data-status="${s?.status||'unseen'}" data-concept="${escapeHTML(n.id)}" data-mastery="${score===null?'unpracticed':Math.round(score*100)}" ${standalone?'':`role="button" tabindex="0" aria-label="Explore ${escapeHTML(n.title)}${description?'. '+escapeHTML(description):''}" aria-pressed="${active}"`} transform="translate(${n.x},${n.y})"><title>${escapeHTML(`${n.id} · ${n.title}. ${n.objective}${description?' '+description:''}`)}</title><rect class="node-card" x="0" y="0" width="${n.w}" height="${n.h}" rx="15" fill="${masteryFill(score)}" stroke="${active?'#39745a':'#b3cbb9'}" stroke-width="${active?2.4:1.2}"/>${active?`<rect x="5" y="5" width="${n.w-10}" height="${n.h-10}" rx="11" fill="none" stroke="#39745a" stroke-width=".8" stroke-dasharray="2 3"/>`:''}<rect x="10" y="11" width="${n.id.length>3?45:35}" height="18" rx="6" fill="${fill}"/><text x="17" y="24" font-size="10.5" fill="#426252">${escapeHTML(n.id)}</text>${next?`<rect class="next-marker" x="${n.w-85}" y="10" width="75" height="20" rx="6" fill="#eee8f8" stroke="#b9a7d0"/><text x="${n.w-79}" y="24" font-size="10" fill="#514369">${n.scope==='BC only'?'Next · BC':'Next check'}</text>`:n.scope==='BC only'?'<text x="'+(n.w-55)+'" y="24" font-size="10" fill="#294637">BC only</text>':''}${lines.map((line,i)=>`<text x="14" y="${45+i*16}" font-size="12.5" fill="#294637" font-weight="600">${escapeHTML(line)}</text>`).join('')}${progress?`<text class="node-mastery" x="14" y="${n.h-(s?.status?29:13)}" font-size="10.5" fill="#294637">${escapeHTML(label)}</text>${s?.status?`<text class="node-diagnostic" x="14" y="${n.h-13}" font-size="10.5" fill="#294637">${DIAGNOSTIC_LABELS[s.status]}</text>`:''}`:''}</g>`;
  }).join('');
  const headerHeight=progress?145:75,exportWidth=Math.max(layout.width,900);
  const header=standalone?`<rect width="100%" height="100%" fill="#fafbf6"/><text x="32" y="35" font-size="24" fill="#294637">${escapeHTML(title)}</text><text x="32" y="58" font-size="13" fill="#52675b">${layout.nodes.length} concepts · arrows run from prerequisite to dependent · dashed lines are other mathematical connections</text>${progress?`<text x="32" y="83" font-size="12" fill="#294637">Practice mastery = latest correct answers ÷ all questions, with at most a 3-point time adjustment. Purple marks the next check.</text>${[null,0,.25,.5,.75,1].map((score,i)=>`<rect x="${32+i*135}" y="98" width="18" height="18" rx="5" fill="${masteryFill(score)}" stroke="#b3cbb9"/><text x="${57+i*135}" y="111" font-size="12" fill="#294637">${score===null?'Not tried':Math.round(score*100)+'%'}</text>`).join('')}`:''}`:'';
  const inside=`<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#729983"/></marker><marker id="relationArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9985bb"/></marker></defs>${header}<g ${standalone?`transform="translate(0,${headerHeight})"`:'id="graph-world"'}>${paths}${cards}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" ${standalone?`width="${exportWidth}" height="${layout.height+headerHeight+15}" viewBox="0 0 ${exportWidth} ${layout.height+headerHeight+15}"`:'id="map-svg" width="100%" height="100%"'} font-family="Nunito, Trebuchet MS, sans-serif" role="${standalone?'img':'group'}" aria-label="${escapeHTML(title)}"><title>${escapeHTML(title)}</title>${inside}</svg>`;
}
