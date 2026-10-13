import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as catalog from '../data/catalog.mjs';
import {questions as originalCalculus} from '../data/questions.mjs';
import {questions as originalAlgebra} from '../data/algebra/questions.mjs';
import {curriculumCoverage,validateCoverageInventory} from '../data/coverage.mjs';
import {validateAttempts,validateBackup,stats,mergeAttempts} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {courseIncludes} from '../src/course.mjs';
import {compileMathText,curriculumText,mathSegments} from '../scripts/math-format.mjs';
const originals=[...originalCalculus,...originalAlgebra];
const record=(q,i=0,correct=true)=>({id:`revision-${q.id}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,12,i)).toISOString(),sessionId:'revision-test',durationMs:50000});

test('All four courses retain ten complete problems per concept and unique active identities',()=>{
 assert.equal(catalog.questions.length,2130);
 assert.equal(new Set(catalog.attemptQuestions.map(q=>q.id)).size,catalog.attemptQuestions.length);
 for(const c of catalog.concepts){
  const items=catalog.questions.filter(q=>q.conceptId===c.id);
  assert.equal(items.length,10,c.id);
  assert.equal(new Set(items.map(q=>q.prompt.toLowerCase().trim())).size,10,c.id);
  for(const q of items){
   assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.text)).size,3,q.id);
   assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1,q.id);
   assert.ok(q.explanation.trim().length>0,q.id);
   if(q.replaces)assert.ok(q.explanation.length>10,q.id);
   assert.doesNotMatch(q.prompt,/^(?:What does (?:the equals sign|f″)|Which (?:property|is the product rule)|What is a simultaneous solution)/,q.id);
   assert.doesNotMatch(q.prompt,/\b(?:that linearization|same derivative|same motion|that model|that series|those two workers)\b/i,q.id);
  }
 }
});
test('Every replaced question is archived unchanged and all unchanged items keep their exact keys',()=>{
 assert.ok(catalog.archivedQuestions.length>=500);
 const active=new Map(catalog.questions.map(q=>[q.id,q]));
 for(const old of originals){
  const replacement=catalog.replacements.get(old.id);
  if(replacement){
   assert.equal(active.has(old.id),false);assert.notEqual(replacement.id,old.id);
   assert.equal(replacement.version,'1.3.0');assert.equal(replacement.replaces,old.id);
   assert.deepEqual(catalog.archivedQuestions.find(q=>q.id===old.id),old);
  }else assert.deepEqual(active.get(old.id),old);
 }
});
test('Old, new, and mixed backups preserve answer meaning and cannot answer replacement problems',()=>{
 const old=originals.map((q,i)=>record(q,i,i%3!==0));
 const newRecords=catalog.questions.filter(q=>q.replaces).map((q,i)=>record(q,i));
 const records=[...old,...newRecords];
 for(const version of catalog.COMPATIBLE_BANK_VERSIONS){
  const restored=validateBackup({schemaVersion:1,bankVersion:version,attempts:records},catalog.attemptQuestions,catalog.COMPATIBLE_BANK_VERSIONS);
  assert.deepEqual(restored,records);assert.deepEqual(mergeAttempts(restored,records),mergeAttempts([],restored));
 }
 const replacement=catalog.questions.find(q=>q.replaces==='1.11-Q1');
 const historical=record(catalog.archivedQuestions.find(q=>q.id===replacement.replaces));
 assert.equal(stats([historical],[replacement.id]).attempted,0);
 assert.throws(()=>validateAttempts([{...historical,questionId:replacement.id}],catalog.attemptQuestions),/version|option/);
 const oldConcept=originalCalculus.filter(q=>q.conceptId==='1.11').map(record);
 const d=diagnosticState({...catalog,attempts:oldConcept,course:'BC'}).nodes.get('1.11');
 assert.equal(d.status,'partial');assert.equal(d.attempted,8);
});
test('All concepts still obey nine-tried, seven-correct, and eight-correct diagnostic boundaries',()=>{
 for(const c of catalog.concepts){
  const course=c.curriculum==='algebra'?'ALG2':'BC';
  const items=catalog.questions.filter(q=>q.conceptId===c.id);
  for(const [count,correct,status] of [[9,9,'partial'],[10,7,'review'],[10,8,'passed']]){
   const attempts=items.slice(0,count).map((q,i)=>record(q,i,i<correct));
   const diagnostic=diagnosticState({...catalog,course,attempts});
   assert.equal(diagnostic.nodes.get(c.id).status,status,`${c.id}: ${count}/${correct}`);
   assert.equal([...diagnostic.nodes.values()].filter(n=>n.attempted).length,1,'No inferred credit for related nodes');
   if(diagnostic.recommendation.targetId)assert.ok(diagnostic.nodes.has(diagnostic.recommendation.targetId));
  }
 }
});
test('Coverage inventory rejects missing AP topics, missing TEKS expectations, and unmapped standards',()=>{
 assert.doesNotThrow(()=>validateCoverageInventory(catalog.concepts,catalog.standards));
 assert.throws(()=>validateCoverageInventory(catalog.concepts.filter(c=>c.id!=='10.15'),catalog.standards),/AP topic/);
 assert.throws(()=>validateCoverageInventory(catalog.concepts,catalog.standards.filter(s=>s.id!=='A.4A')),/ALG1 TEKS/);
 assert.throws(()=>validateCoverageInventory(catalog.concepts,catalog.standards.map(s=>s.id==='A2.7A'?{...s,conceptIds:[]}:s)),/Unrepresented/);
 const rows=curriculumCoverage(catalog.concepts,catalog.questions,catalog.standards);
 assert.equal(rows.filter(r=>r.id.startsWith('AP.')).length,111);
 assert.equal(rows.filter(r=>!r.id.startsWith('AP.')&&r.kind==='content').length,97);
 for(const row of rows){
  assert.equal(new Set(row.questionIds).size,row.questionCount,row.id);
  for(const id of row.questionIds){const q=catalog.questions.find(q=>q.id===id);assert.ok(q,row.id+' '+id);assert.ok(row.conceptIds.includes(q.conceptId));}
 }
 const correlation=rows.find(r=>r.id==='A.4A');
 assert.ok(correlation.questionIds.includes('MATH_055-R2-Q1'));
 assert.ok(catalog.questions.find(q=>q.id==='MATH_055-R2-Q1').prompt.includes('calculate'));
});
test('Revised math renders without lost source characters or raw powers and radicals',()=>{
 const revised=catalog.questions.filter(q=>q.replaces);
 compileMathText([],revised);
 for(const text of curriculumText([],revised)){
  const parts=mathSegments(text);assert.equal(parts.map(s=>s.text).join(''),text);
  for(const part of parts)if(!part.tex)assert.doesNotMatch(part.text,/[√∛^_²³⁻₀-₉ₙₓ]/,text);
 }
});
test('Each course exports active questions, explicit evidence, and separate historical wording',async()=>{
 await import('../scripts/build.mjs');
 for(const course of ['ALG1','ALG2','AB','BC']){
  const data=JSON.parse(await readFile(`dist/data/${course.toLowerCase()}/ontology.json`,'utf8'));
  const archive=JSON.parse(await readFile(`dist/data/${course.toLowerCase()}/archived-questions.json`,'utf8'));
  const activeIds=new Set(data.questions.map(q=>q.id));
  for(const q of archive.questions){assert.ok(!activeIds.has(q.id));assert.ok(courseIncludes(course,catalog.concepts.find(c=>c.id===q.conceptId)));}
  for(const row of data.coverage)for(const id of row.questionIds)assert.ok(activeIds.has(id),course+' '+id);
  const csv=await readFile(`dist/data/${course.toLowerCase()}/coverage.csv`,'utf8');assert.ok(csv.includes('questionIds'));assert.ok(csv.includes('assessmentLimit'));
  const audit=await readFile(`dist/data/${course.toLowerCase()}/question-audit.csv`,'utf8');for(const c of data.concepts)assert.ok(audit.includes(c.id));
 }
});

// Independent calculations for error-prone new models, limits, volumes, and
// estimates. All three choices are checked, not just the keyed choice.
const integrate=(f,a,b,n=12000)=>{let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+(b-a)*i/n);return sum*(b-a)/(3*n);};
const near=(a,b)=>Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));
const cases=[
 ['MATH_055-Q1',()=>{const xs=[1,2,3],ys=[2,1,3],xm=2,ym=2;return xs.reduce((s,x,i)=>s+(x-xm)*(ys[i]-ym),0)/Math.sqrt(xs.reduce((s,x)=>s+(x-xm)**2,0)*ys.reduce((s,y)=>s+(y-ym)**2,0));},{'0.50':.5,'1.00':1,'−0.50':-.5}],
 ['MATH_055-Q8',()=>[[1,4],[2,4],[3,8]].reduce((s,[x,y])=>s+(y-(2*x+1))**2,0),{'3':3,'1':1,'9':9}],
 ['MATH_062-Q6',()=>[5-4,5-7,13-12].reduce((s,r)=>s+r*r,0),{'6':6,'0':0,'4':4}],
 ['MATH_085-Q7',()=>[1,0,1].reduce((s,y)=>s+(y-2/3)**2,0),{'2/3':2/3,'0':0,'4/3':4/3}],
 ['4.4-Q4',()=>-6*2/8,{'−3/2 m/s':-1.5,'3/2 m/s':1.5,'−8/3 m/s':-8/3}],
 ['4.4-Q10',()=>-2*6/4,{'−3 units/s':-3,'3 units/s':3,'−4/3 units/s':-4/3}],
 ['5.12-Q5',()=>-(1+(-3/4)**2)/4,{'−25/64':-25/64,'−3/4':-.75,'25/64':25/64}],
 ['6.2-Q9',()=>4-integrate(x=>x*x,0,2),{'4/3':4/3,'−4/3':-4/3,'8/3':8/3}],
 ['6.14-Q5',()=>integrate(x=>4*x*(1+x*x),0,1),{'3':3,'2':2,'4':4}],
 ['7.5-Q9',()=>{let x=0,y=2;for(let i=0;i<2;i++){y+=x-y;x++;}return y;},{'1':1,'−2':-2,'0':0}],
 ['7.9-Q8',()=>{const p=20,rate=.1*p*(1-p/80);return .1*rate*(1-2*p/80);},{'0.075':.075,'0.15':.15,'−0.075':-.075}],
 ['7.9-Q9',()=>{const p=60,rate=.1*p*(1-p/80);return .1*rate*(1-2*p/80);},{'−0.075':-.075,'0.075':.075,'−0.15':-.15}],
 ['8.5-Q5',()=>integrate(y=>y+2-y*y,-1,2),{'9/2':4.5,'9':9,'3/2':1.5}],
 ['8.6-Q5',()=>integrate(x=>Math.abs(x*x-2*x),0,3),{'8/3':8/3,'0':0,'9':9}],
 ['8.7-Q8',()=>integrate(x=>(2*x)**2/2,0,3),{'18':18,'36':36,'9':9}],
 ['8.8-Q1',()=>integrate(x=>Math.PI*(4*x/2)**2/2,0,1),{'2π/3':2*Math.PI/3,'8π/3':8*Math.PI/3,'π/3':Math.PI/3}],
 ['8.8-Q2',()=>integrate(x=>Math.sqrt(3)*(2*x)**2/4,0,1),{'√3/3':Math.sqrt(3)/3,'√3':Math.sqrt(3),'4√3/3':4*Math.sqrt(3)/3}],
 ['8.8-Q9',()=>integrate(x=>Math.PI*(x+1)**2/2,0,1),{'7π/6':7*Math.PI/6,'7π/24':7*Math.PI/24,'7π/3':7*Math.PI/3}],
 ['8.11-Q10',()=>integrate(x=>Math.PI*(4-x*x),0,1),{'11π/3':11*Math.PI/3,'−11π/3':-11*Math.PI/3,'π/3':Math.PI/3}],
 ['8.12-Q8',()=>integrate(x=>Math.PI*((3-x)**2-1),0,1),{'16π/3':16*Math.PI/3,'8π/3':8*Math.PI/3,'−16π/3':-16*Math.PI/3}],
 ['9.8-Q4',()=>integrate(t=>(3*Math.cos(2*t))**2/2,-Math.PI/4,Math.PI/4),{'9π/8':9*Math.PI/8,'9π/4':9*Math.PI/4,'9π/16':9*Math.PI/16}],
 ['9.9-Q9',()=>integrate(t=>1/2,0,Math.PI/3)+integrate(t=>(2*Math.cos(t))**2/2,Math.PI/3,Math.PI/2),{'π/3−√3/4':Math.PI/3-Math.sqrt(3)/4,'π/4':Math.PI/4,'π/3+√3/4':Math.PI/3+Math.sqrt(3)/4}],
 ['10.11-Q4',()=>Math.log(1)+(1/1)*(.2),{'0.2':.2,'1.2':1.2,'0.182':.182}],
 ['10.12-Q1',()=>12*.5**3/6,{'1/4':.25,'3/2':1.5,'1/2':.5}],
 ['10.12-Q9',()=>120*.1**5/120,{'0.00001':.00001,'0.0001':.0001,'0.0012':.0012}],
 ['10.14-Q5',()=>2**5/(5*4*3*2),{'4/15':4/15,'1/120':1/120,'−4/15':-4/15}],
];
for(const [slot,calculate,values] of cases)test(`Independently verify revised answer ${slot}`,()=>{
 const q=catalog.questions.find(q=>q.replaces===slot);assert.ok(q,slot);
 const value=calculate();assert.ok(Number.isFinite(value));
 assert.deepEqual(q.options.filter(o=>near(value,values[o.text])).map(o=>o.id),[q.correctOptionId]);
});
test('New three-variable word problems and parabola models satisfy their original constraints',()=>{
 for(const [slot,valid] of [
  ['MATH_071-Q2',([x,y,z])=>x+y+z===9&&2*x+3*y+5*z===25&&x===y],
  ['MATH_071-Q10',([p,b,f])=>p+b+f===10&&2*p+6*b+3*f===31&&p===2*b],
  ['MATH_071-Q9',([x,y,z])=>x+y+z===6&&2*x-y+z===3&&x+2*y-z===2],
  ['MATH_086-Q10',([a,b,c])=>[[0,2],[1,6],[2,12]].every(([x,y])=>a*x*x+b*x+c===y)],
 ]){
  const q=catalog.questions.find(q=>q.replaces===slot);
  const matches=q.options.filter(o=>valid(o.text.slice(1,-1).split(',').map(Number)));
  assert.deepEqual(matches.map(o=>o.id),[q.correctOptionId],slot);
 }
});
