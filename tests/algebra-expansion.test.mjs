import test from 'node:test';
import assert from 'node:assert/strict';
import * as catalog from '../data/catalog.mjs';
import {concepts,relationships} from '../data/algebra/curriculum.mjs';
import {questionAlignment} from '../data/algebra/question-alignment.mjs';
import {courseIncludes} from '../src/course.mjs';
import {topologicalOrder,validateBackup} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {drawGraph,graphLayout} from '../src/graph.mjs';
import {evaluate,near} from './helpers/arithmetic.mjs';

const id=n=>`MATH_${String(n).padStart(3,'0')}`;
const additions=concepts.filter(c=>Number(c.id.slice(5))>=87);
const items=catalog.questions.filter(q=>additions.some(c=>c.id===q.conceptId));
const item=(n,k)=>items.find(q=>q.id===`${id(n)}-Q${k}`);

test('Every added skill is in the connected, acyclic Algebra I graph and its SVG export',()=>{
 assert.equal(additions.length,20);
 const nodes=concepts.filter(c=>courseIncludes('ALG1',c)),ids=new Set(nodes.map(c=>c.id));
 const edges=relationships.filter(e=>ids.has(e.source)&&ids.has(e.target));
 assert.equal(topologicalOrder(nodes,edges).length,85);
 const seen=new Set([nodes[0].id]),queue=[nodes[0].id];
 for(const current of queue)for(const e of edges){
  const next=e.source===current?e.target:e.target===current?e.source:null;
  if(next&&!seen.has(next)){seen.add(next);queue.push(next);}
 }
 assert.equal(seen.size,nodes.length,'No isolated concepts or disconnected clusters');
 const svg=drawGraph(graphLayout(nodes,edges),catalog.units,{standalone:true});
 for(const c of additions){
  assert.ok(c.prerequisites.length>0,c.id);
  assert.ok(svg.includes(`data-concept="${c.id}"`),c.id);
  for(const p of c.prerequisites)assert.ok(svg.includes(`data-source="${p}" data-target="${c.id}"`),`${p} → ${c.id}`);
  assert.ok(courseIncludes('ALG2',c));assert.ok(!courseIncludes('BC',c));
 }
 for(const [parent,child] of [[87,52],[91,50],[93,94],[94,54],[98,57],[57,100],[102,60],[104,62],[105,65],[106,65]]){
  assert.ok(edges.some(e=>e.source===id(parent)&&e.target===id(child)),`${parent} → ${child}`);
 }
});

test('All 200 new problems have explicit TEKS evidence while earlier evidence remains',()=>{
 assert.equal(items.length,200);
 const alignment=questionAlignment(catalog.questions),covered=new Set([...alignment.values()].flat());
 for(const c of additions){
  const questions=items.filter(q=>q.conceptId===c.id);assert.equal(questions.length,10);
  for(const q of questions){
   assert.equal(q.version,'1.4.0');assert.ok(covered.has(q.id),q.id);
   assert.doesNotMatch(q.prompt,/^(?:Define|What is meant|Which definition|What does .* mean)/i);
  }
 }
 assert.ok(alignment.get('A.10E').some(q=>q.startsWith('MATH_057')));
 assert.ok(alignment.get('A.10E').some(q=>q.startsWith('MATH_098')));
});

test('A focused factoring check saves 8/10, advances to its dependent, and probes prerequisites at 7/10',()=>{
 const attempts=items.filter(q=>q.conceptId===id(98)).map((q,i)=>({id:`expanded-${i}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:i<8?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct:i<8,answeredAt:new Date(Date.UTC(2026,9,15,12,i)).toISOString(),sessionId:'expansion-test',durationMs:50000}));
 const backup={schemaVersion:1,bankVersion:catalog.BANK_VERSION,attempts};
 const restored=validateBackup(JSON.parse(JSON.stringify(backup)),catalog.attemptQuestions,catalog.COMPATIBLE_BANK_VERSIONS);
 assert.deepEqual(restored,attempts);
 const state=diagnosticState({...catalog,course:'ALG1',attempts:restored});
 assert.equal(state.nodes.get(id(98)).status,'passed');assert.equal(state.nodes.get(id(98)).correctnessScore,.8);
 assert.equal(state.recommendation.targetId,id(57));
 assert.equal([...state.nodes.values()].filter(n=>n.status!=='unseen').length,1);
 const failed=attempts.map((a,i)=>i===7?{...a,correct:false,choiceId:item(98,8).options.find(o=>o.id!==item(98,8).correctOptionId).id}:a);
 const review=diagnosticState({...catalog,course:'ALG1',attempts:failed});
 assert.equal(review.nodes.get(id(98)).status,'review');assert.equal(review.recommendation.kind,'prerequisite');
 assert.ok(concepts.find(c=>c.id===id(98)).prerequisites.includes(review.recommendation.targetId));
});

// Check every new option against independent mathematical constraints. Tests
// reject equivalent distractors and incomplete solution sets, not only bad keys.
const xy=(expr,x,y)=>evaluate(expr.replaceAll('y',`(${y})`),x);
const equation=(expr,x,y=0)=>{const [l,r]=expr.split('=');return near(xy(l,x,y),xy(r,x,y));};
const pair=text=>text.startsWith('(')&&text.endsWith(')')?text.slice(1,-1).split(',').map(e=>evaluate(e)):null;
const samples=[-4,-1.7,0,.3,2,5.5];
const checks=new Map();
const add=(n,k,check)=>checks.set(`${id(n)}-Q${k}`,check);
const numeric=(n,k,value)=>add(n,k,text=>near(evaluate(text.replace(/ (?:units|meters|centimeters|seconds|dollars|miles|km\/h|mL|cm|square units).*$/, '').replace(/(?:st|nd|rd|th)$/,'')),value));
const polynomial=(n,k,expression)=>add(n,k,text=>samples.every(x=>near(evaluate(expression,x),evaluate(text,x))));
const line=(n,k,points)=>add(n,k,text=>points.every(([x,y])=>equation(text,x,y)));
const constraint=(n,k,check)=>add(n,k,text=>{const values=pair(text);return values?.length===2&&check(...values);});
const safe=(f,text)=>{try{return f(text);}catch{return false;}};

// Recover polynomial coefficients from the question itself; compute all real
// roots independently and require the option to give the complete root set.
for(const q of items){
 const m=/^Solve (.+?)(?: over the real numbers)?\.$/.exec(q.prompt);
 if(!m||!/^MATH_(087|100|101|102|103)-/.test(q.id)||m[1].split('=').length!==2)continue;
 const [l,r]=m[1].split('='),f=x=>evaluate(l,x)-evaluate(r,x),c=f(0),a=(f(1)+f(-1))/2-c,b=(f(1)-f(-1))/2;
 const d=b*b-4*a*c,expected=Math.abs(a)<1e-10?[-c/b]:d<0?[]:d===0?[-b/(2*a)]:[(-b-Math.sqrt(d))/(2*a),(-b+Math.sqrt(d))/(2*a)].sort((x,y)=>x-y);
 checks.set(q.id,text=>{
  if(!expected.length)return text==='No real solution';
  if(!text.startsWith('x='))return false;
  const roots=text.replaceAll('x=','').replace(' only','').split(' or ').flatMap(s=>s.includes('±')?[s.replace('±','+'),s.replace('±','−')]:[s]).map(s=>evaluate(s)).sort((x,y)=>x-y);
  return roots.length===expected.length&&roots.every((r,i)=>near(r,expected[i]));
 });
}

// Linear models: derive quantities from their costs, geometry, rates, or totals.
[(74-18)/7,(38-2*5)/4,72/3,(100-10)/3,(50-5)/.75,(120-52)/4,250*.2/.1-250,(155-35)/12,64/(2+6),(31-6)/2.5].forEach((v,i)=>numeric(88,i+1,v));
const inequality=(text,x)=>{
 if(text==='All real numbers')return true;if(text==='No solution')return false;
 if(text.startsWith('{'))return text.slice(1,-1).split(',').map(Number).includes(x);
 return text.split(' or ').some(clause=>clause.split(' and ').every(part=>{
  const parts=part.split(/([<>≤≥=])/),values=parts.filter((_,i)=>i%2===0).map(v=>evaluate(v,x));
  return parts.filter((_,i)=>i%2===1).every((op,i)=>op==='<'?values[i]<values[i+1]:op==='>'?values[i]>values[i+1]:op==='≤'?values[i]<=values[i+1]:op==='≥'?values[i]>=values[i+1]:values[i]===values[i+1]);
 }));
};
const bounds=[x=>-3<2*x+1&&2*x+1<=9,x=>2<=(x+1)/3&&(x+1)/3<5,x=>-6<=-2*x&&-2*x<4,x=>3*x-2>=7&&x+4<=9,x=>2*x+1< -3||x-5>=2,x=>x+2<=1&&2*x>4,x=>x-1<3||x+2>=6,x=>Number.isInteger(x)&&x>=0&&10+4*x>=20&&10+4*x<=34,x=>5<=10-x&&10-x<=8,x=>0<3*(x-2)&&3*(x-2)<=12];
bounds.forEach((bound,i)=>add(89,i+1,text=>Array.from({length:321},(_,j)=>(j-160)/8).every(x=>inequality(text,x)===bound(x))));

// Two distinct points uniquely determine each line, including vertical lines.
[[[2,7],[3,10]],[[-1,4],[3,-4]],[[4,-2],[6,-1]],[[0,6],[4,0]],[[0,7],[-1,5]],[[4,0],[0,6]],[[-2,-7],[2,5]],[[-3,2],[0,0]],[[1,2],[5,3]],[[0,-3],[5,-1]]].forEach((p,i)=>line(90,i+1,p));
[[[2,1],[3,4]],[[3,2],[5,1]],[[-1,4],[2,2]],[[0,0],[3,-2]],[[4,-3],[8,-4]],[[-2,5],[0,6]],[[3,-4],[3,8]],[[2,-1],[3,-3]],[[4,0],[5,4]],[[-5,2],[8,2]]].forEach((p,i)=>line(91,i+1,p));
for(const [n,equations] of [[92,[['y=2x+1','x+y=10'],['x=y+4','2x+y=17'],['y=3x−5','2x+y=15'],['x=2y−1','x+3y=14'],['y=−x+6','y=2x'],['y=x/2+1','y=−x+4'],['x+y=1','y=3x'],null,null,['x=3−2y','3x+y=4']]],[93,[['x+y=7','x−y=1'],['2x+y=11','3x−y=9'],['3x+2y=16','3x−2y=8'],['2x+3y=13','4x−y=5'],['3x+2y=12','2x+3y=13'],['4x+3y=5','2x−3y=7'],['5x−2y=−1','3x+2y=9'],null,null,['3x+4y=1','5x−4y=3']]]]){
 equations.forEach((eqs,i)=>{if(eqs)constraint(n,i+1,(x,y)=>eqs.every(e=>equation(e,x,y)));});
 // Dependent systems need an entire line, not just one valid pair.
 add(n,8,text=>{
  const match=/^All pairs \((.+),(.+)\) for real ([xy])$/.exec(text);if(!match)return false;
  return samples.every(t=>{const value=s=>evaluate(s.replaceAll(match[3],'x'),t),x=value(match[1]),y=value(match[2]);return n===92?near(y,2*x+3)&&near(2*y,4*x+6):near(2*x+4*y,6)&&near(x+2*y,3);});
 });
 add(n,9,text=>text==='No solution');
}
[(a,c)=>a+c===20&&8*a+5*c===130,(q,d)=>q+d===20&&25*q+10*d===380,(n,p)=>n+p===18&&3*n+2*p===44,(x,y)=>x+y===10&&near(.1*x+.3*y,1.8),(d,c)=>20+5*d===c&&8+8*d===c,(b,c)=>b+c===18&&b-c===12,(x,y)=>x+y===27&&x-y===5,(a,s)=>a+s===20&&20*a+12*s===304,(c,r)=>c+r===18&&2*c+4*r===50,(c,t)=>c+t===16&&3*c+2*t===42].forEach((f,i)=>constraint(94,i+1,f));

// Polynomial identities are compared at more inputs than their degree.
['(x+3)(x+5)','(2x−1)(x+4)','(3x+2)²','(x−7)²','(5x+2)(5x−2)','(x+2)(x²−3x+1)','(2x−3)(x²+x−4)','(x²+2x+1)(x−1)','(x+4)(x−2)','(3x−1)²'].forEach((e,i)=>polynomial(95,i+1,e));
['12x+18','15x²+10x','8x³−12x²','−6x²−9x','14x²−21x+7','18x³+24x²+6x','5x⁴−15x³','16x³+4x','(24x²+18x)/(6x)'].forEach((e,i)=>{
 if(i===8)add(96,9,text=>samples.filter(x=>x!==0).every(x=>near(evaluate(e,x),evaluate(text,x))));else polynomial(96,i+1,e);
});numeric(96,10,3*5);
['x²+7x+12','x²−9x+20','x²+x−12','x²−2x−15','x²+2x−24','x²−11x+30','x²+12x+35','x²−10x+25','(x²+9x+20)/(x+4)'].forEach((e,i)=>add(97,i+1,text=>samples.filter(x=>x!==-4).every(x=>near(evaluate(e,x),evaluate(text,x)))));numeric(97,10,3+2);
['2x²+7x+3','3x²+11x+6','6x²+x−2','4x²−12x+9','5x²−13x+6','6x²−7x−3','8x²+14x+3','6x²+18x+12','(6x²+17x+12)/(2x+3)'].forEach((e,i)=>polynomial(98,i+1,e));numeric(98,10,2*1);
['x²−49','9x²−16','x²+14x+49','4x²−20x+25','25x²−1'].forEach((e,i)=>polynomial(99,i+1,e));numeric(99,6,-2*6);polynomial(99,7,'(x²−64)/(x+8)');numeric(99,8,2*3*2);polynomial(99,9,'2x²−50');polynomial(99,10,'(x+1)²−16');
numeric(100,9,(-1+Math.sqrt(1+4*20))/2);numeric(100,10,(-1+Math.sqrt(1+4*56))/2);
numeric(101,9,Math.sqrt(144));numeric(101,10,Math.sqrt(25));
['x²+6x+2','x²−8x+10','2x²+8x+3','3x²−6x+7','x²+5x+1'].forEach((e,i)=>polynomial(102,i+1,e));
constraint(102,10,(x,y)=>x===12/2&&y===x*x-12*x+20);
[[6,1,4,-5],[7,4,-4,1],[8,1,2,4]].forEach(([k,a,b,c])=>add(103,k,text=>{
 const d=b*b-4*a*c,m=/^([−\d]+); (two|one|no) real root/.exec(text);return !!m&&near(evaluate(m[1]),d)&&m[2]===(d>0?'two':d===0?'one':'no');
}));numeric(103,9,(-4)**2/4);

numeric(104,1,-5*2**2+20*2+1);numeric(104,2,-2*10**2+40*10);numeric(104,3,10*(20-10));numeric(104,4,3**2-6*3+13);numeric(104,5,4);
add(104,6,text=>inequality(text.replaceAll('y','x'),-16)&&inequality(text.replaceAll('y','x'),0)&&!inequality(text.replaceAll('y','x'),1)&&!inequality(text.replaceAll('y','x'),-17));
for(const [k,f,domain,maximum] of [[7,x=>(x-3)**2+1,[0,2],false],[8,x=>-x*x+6*x+1,[0,4],true]])add(104,k,text=>{
 const [value,at]=text.split(' at x=').map(Number);if(at<domain[0]||at>domain[1]||!near(value,f(at)))return false;
 return Array.from({length:41},(_,i)=>domain[0]+i*(domain[1]-domain[0])/40).every(x=>maximum?value>=f(x):value<=f(x));
});
add(104,9,text=>inequality(text.replaceAll('A','x'),11)&&inequality(text.replaceAll('A','x'),32)&&!inequality(text.replaceAll('A','x'),10)&&!inequality(text.replaceAll('A','x'),33));numeric(104,10,2*3**2-12*3+23);

[5+9*3,7+3*(-4),null,18+9*(-5),6*7-2,1+(42+8)/5,2+4*3,12+7*4,16-(22-16),20+5*7].forEach((v,i)=>{if(v!==null)numeric(105,i+1,v);});
add(105,3,text=>[1,3,7,12].every(n=>near(evaluate(text.replaceAll('n','x'),n),11+(n-3)*(27-11)/(7-3))));
[3*2**5,81/3**3,null,2*(-3)**5,160*.5**4,12/Math.cbrt(96/12),-2*(-3)**3,300*3**3,36/(108/36),81*(54/81)**4].forEach((v,i)=>{if(v!==null)numeric(106,i+1,v);});
add(106,3,text=>[1,2,3,6].every(n=>near(evaluate(text.replaceAll('n','x'),n),5*3**(n-1))));

test('All 200 new questions have exactly one mathematically valid option, including complete root sets',()=>{
 assert.equal(checks.size,200);
 for(const q of items){
  assert.ok(checks.has(q.id),`Missing independent check: ${q.id}`);
  const matches=q.options.filter(o=>safe(checks.get(q.id),o.text));
  assert.deepEqual(matches.map(o=>o.id),[q.correctOptionId],q.id+' '+q.prompt);
 }
});
