import test from 'node:test';
import assert from 'node:assert/strict';
import {concepts,relationships,units} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';
import {topologicalOrder,csv,stats,validateAttempts,mergeAttempts} from '../src/core.mjs';
import {graphLayout,drawGraph} from '../src/graph.mjs';

test('Every AP BC topic reference is covered exactly once, plus 16 foundations',()=>{
  const expected=[16,10,6,7,12,14,9,13,9,15].flatMap((count,i)=>Array.from({length:count},(_,j)=>`${i+1}.${j+1}`));
  assert.deepEqual(concepts.filter(c=>c.unit).map(c=>c.cedTopic),expected);
  assert.equal(concepts.filter(c=>!c.unit).length,16);
  assert.equal(new Set(concepts.map(c=>c.id)).size,127);
});
test('All 127 concepts have ten distinct, complete and consistently keyed questions',()=>{
  assert.equal(questions.length,1270);assert.equal(new Set(questions.map(q=>q.id)).size,1270);assert.equal(new Set(questions.map(q=>q.prompt)).size,1270);
  for(const c of concepts){const items=questions.filter(q=>q.conceptId===c.id);assert.equal(items.length,10,c.id);for(const q of items){assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.text)).size,3,q.id);assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1);assert.ok(q.prompt.length>10&&q.explanation.trim().length>0,q.id);}}
});
test('Dependency graph has valid references, no duplicate typed edges, and no cycles',()=>{
  const order=topologicalOrder(concepts,relationships),position=new Map(order.map((id,i)=>[id,i]));
  assert.equal(order.length,127);
  assert.equal(new Set(relationships.map(e=>`${e.source}/${e.target}/${e.type}`)).size,relationships.length);
  for(const e of relationships){assert.ok(position.has(e.source)&&position.has(e.target));assert.notEqual(e.source,e.target);if(e.type==='prerequisite')assert.ok(position.get(e.source)<position.get(e.target));}
});
test('AB prerequisite closure excludes BC-only concepts; all BC-only topics are labeled',()=>{
  const bc=['6.11','6.12','6.13','7.5','7.9','8.13',...Array.from({length:9},(_,i)=>`9.${i+1}`),...Array.from({length:15},(_,i)=>`10.${i+1}`)];
  assert.deepEqual(concepts.filter(c=>c.scope==='BC only').map(c=>c.id),bc);
  const ab=new Set(concepts.filter(c=>c.scope!=='BC only').map(c=>c.id));
  for(const c of concepts.filter(c=>ab.has(c.id)))for(const p of c.prerequisites)assert.ok(ab.has(p),`${c.id} needs ${p}`);
});
test('The ontology exposes instruction and provenance, not only topic labels',()=>{
  for(const c of concepts){for(const field of ['objective','rule','misconception','firstStep','potentialFriction','support'])assert.ok(c[field]?.length>5,`${c.id}.${field}`);assert.ok(c.subskills.length>=2);assert.ok(c.sourceIds.length);}
  for(const e of relationships)assert.ok(e.rationale&&e.provenance);
});
test('Cycle and dangling dependency detection fail explicitly',()=>{
  assert.throws(()=>topologicalOrder([{id:'a'},{id:'b'}],[{source:'a',target:'b',type:'prerequisite'},{source:'b',target:'a',type:'prerequisite'}]),/acyclic/);
  assert.throws(()=>topologicalOrder([{id:'a'}],[{source:'a',target:'b',type:'prerequisite'}]),/Dangling/);
});
test('Full graph places every node, with forward prerequisite columns and unique SVG IDs',()=>{
  const layout=graphLayout(concepts,relationships),node=new Map(layout.nodes.map(n=>[n.id,n]));assert.equal(node.size,127);
  for(const e of relationships.filter(e=>e.type==='prerequisite'))assert.ok(node.get(e.source).x<node.get(e.target).x);
  const svg=drawGraph(layout,units,{standalone:true});assert.equal((svg.match(/class="graph-node/g)||[]).length,127);assert.ok(svg.includes('marker-end'));assert.ok(svg.includes('stroke-dasharray'));
});
test('Focused graph contains and displays cross-unit dependencies',()=>{
  const c=concepts.find(c=>c.id==='10.11'),ids=new Set([c.id,...c.prerequisites]);
  const layout=graphLayout(concepts.filter(c=>ids.has(c.id)),relationships,{focus:c.id});
  assert.equal(layout.nodes.length,4);assert.equal(layout.edges.filter(e=>e.target===c.id&&e.type==='prerequisite').length,3);
});
test('CSV correctly quotes commas, quotes, newlines, Unicode and formula-like strings',()=>{
  const result=csv([{text:'A, "B"\n∫',list:['1.1','F01'],unsafe:'=SUM(A1:A2)'}],['text','list','unsafe']);
  assert.ok(result.startsWith('\uFEFF'));assert.ok(result.includes('"A, ""B""\n∫"'));assert.ok(result.includes('"1.1; F01"'));assert.ok(result.includes('"\'=SUM(A1:A2)"'));
});
const sample=questions.find(q=>q.id==='1.11-Q1'),wrong=sample.options.find(o=>o.id!==sample.correctOptionId).id;
const attempt=(id,choiceId,answeredAt)=>({id,questionId:sample.id,conceptId:sample.conceptId,bankVersion:sample.version,choiceId,correct:choiceId===sample.correctOptionId,answeredAt,sessionId:'test'});
const first=attempt('first',wrong,'2026-10-11T10:00:00.000Z'),retry=attempt('retry',sample.correctOptionId,'2026-10-11T10:01:00.000Z');
test('A retry improves latest accuracy without rewriting the first attempt',()=>{
  const s=stats([first,retry],[sample.id,'1.11-Q2','1.11-Q3','1.11-Q4','1.11-Q5']);
  assert.equal(s.firstAccuracy,0);assert.equal(s.latestAccuracy,1);assert.equal(s.allAccuracy,.5);assert.equal(s.attempted,1);assert.equal(s.available,5);assert.equal(s.total,2);
});
test('Unanswered questions are unscored, and unrelated attempts are excluded',()=>{
  assert.equal(stats([],[sample.id]).firstAccuracy,null);assert.equal(stats([first],['2.2-Q1']).total,0);
});
test('Imported records are normalized and correctness is recomputed from the answer key',()=>{
  const records=validateAttempts([{...first,correct:true,extra:'ignored'}],questions);
  assert.equal(records[0].correct,false);assert.ok(!('extra' in records[0]));
});
test('Invalid backup fields and duplicate IDs are rejected before a merge',()=>{
  assert.throws(()=>validateAttempts([first,first],questions),/duplicate/);
  for(const override of [{questionId:'unknown'},{conceptId:'fake'},{bankVersion:'99'},{choiceId:'fake'},{answeredAt:'yesterday'}])assert.throws(()=>validateAttempts([{...first,...override}],questions));
});
test('Import merge is idempotent and retains local attempts',()=>{
  const merged=mergeAttempts([first],[retry,first]);assert.equal(merged.length,2);assert.deepEqual(mergeAttempts(merged,[retry,first]),merged);
});
test('First and latest metrics use chronology even when a backup is out of order',()=>{
  const s=stats([retry,first],[sample.id]);assert.equal(s.firstAccuracy,0);assert.equal(s.latestAccuracy,1);
});

// Independent numerical spot checks of nontrivial authored calculus answers.
const integrate=(f,a,b,n=20000)=>{let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+(b-a)*i/n);return sum*(b-a)/(3*n);};
const numericAnswers=[
  ['6.2-Q3',()=>1*(2+4)/2+2*(4+6)/2,{'13':13,'10':10,'12':12}],
  ['6.11-Q4',()=>integrate(x=>x*Math.exp(x),0,1),{'1':1,'e−1':Math.E-1,'e':Math.E}],
  ['8.4-Q5',()=>integrate(x=>x-x*x,0,1),{'1/6':1/6,'1/3':1/3,'1/2':1/2}],
  ['8.5-Q2',()=>integrate(y=>1-y*y,-1,1),{'4/3':4/3,'2/3':2/3,'2':2}],
  ['8.11-Q3',()=>integrate(x=>Math.PI*(4-x*x),0,2),{'16π/3':16*Math.PI/3,'8π/3':8*Math.PI/3,'4π':4*Math.PI}],
  ['9.9-Q1',()=>integrate(()=>.5*(9-1),0,Math.PI/2),{'2π':2*Math.PI,'π':Math.PI,'4π':4*Math.PI}],
  ['10.12-Q2',()=>6*Math.pow(.1,3)/6,{'0.001':.001,'0.006':.006,'0.01':.01}],
];
for(const [id,calc,answers] of numericAnswers)test(`Independent mathematical check: ${id}`,()=>{
  const q=questions.find(q=>q.id===id),answer=q.options.find(o=>o.id===q.correctOptionId).text;
  assert.ok(Math.abs(calc()-answers[answer])<1e-7,`${id}: ${answer}`);
});
