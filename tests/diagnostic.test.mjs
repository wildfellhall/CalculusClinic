import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticState} from '../src/diagnostic.mjs';
import {concepts,relationships,units} from '../data/curriculum.mjs';
import {questions,COMPATIBLE_BANK_VERSIONS} from '../data/questions.mjs';
import {validateBackup,mergeAttempts} from '../src/core.mjs';
import {drawGraph,graphLayout,masteryFill} from '../src/graph.mjs';

const attempt=(bank,id,index,correct,time)=>{
  const q=bank.filter(q=>q.conceptId===id)[index];
  return {id:`${q.id}-${time}`,questionId:q.id,conceptId:id,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,0,time)).toISOString(),sessionId:'diagnostic-test'};
};
const answers=(id,correct=8,time=0,count=10)=>Array.from({length:count},(_,i)=>attempt(questions,id,i,i<correct,time+i));
const diagnose=(attempts=[],course='BC')=>diagnosticState({concepts,relationships,questions,attempts,course});
const miniConcepts=['A','B','C','D','E','X'].map((id,i)=>({id,title:id,unit:i<3?0:1,scope:id==='X'?'BC only':'AB & BC'}));
const miniQuestions=miniConcepts.flatMap(c=>Array.from({length:10},(_,i)=>({id:`${c.id}-Q${i}`,conceptId:c.id,version:'1.0.0',options:[{id:'yes'},{id:'no'}],correctOptionId:'yes'})));
const edge=(source,target,type='prerequisite')=>({source,target,type});
const miniEdges=[edge('A','B'),edge('B','C'),edge('A','D'),edge('D','E'),edge('C','X'),edge('A','X','related')];
const sample=(id,correct=8,time=0,count=10)=>Array.from({length:count},(_,i)=>attempt(miniQuestions,id,i,i<correct,time+i));
const mini=(attempts=[],edges=miniEdges,course='BC')=>diagnosticState({concepts:miniConcepts,relationships:edges,questions:miniQuestions,attempts,course});

test('Cold start recommends an actual starting check with every other concept unknown',()=>{
  const d=diagnose();assert.equal(d.recommendation.kind,'start');assert.equal(d.recommendation.targetId,'1.2');
  assert.deepEqual(d.summary,{passed:0,review:0,partial:0,unseen:127});assert.equal(d.latestPassedId,null);
});
test('Eight correct answers are insufficient until the entire concept has been tried',()=>{
  const d=diagnose(answers('1.11',8,0,8));
  assert.equal(d.nodes.get('1.11').status,'partial');assert.equal(d.recommendation.kind,'continue');
  assert.equal(d.recommendation.targetId,'1.11');assert.equal(d.latestPassedId,null);
});
test('A full 8/10 check passes and advances to an actual dependent, without inferred mastery',()=>{
  const d=diagnose(answers('1.11'));
  assert.equal(d.nodes.get('1.11').status,'passed');assert.equal(d.latestPassedId,'1.11');
  assert.equal(d.recommendation.kind,'advance');assert.equal(d.recommendation.targetId,'1.12');
  assert.equal(d.nodes.get('1.2').status,'unseen');assert.equal(d.nodes.get('1.12').masteryScore,null);
  assert.ok(d.recommendation.reason.includes('8/10'));
});
test('A lower complete check steps backward to a prerequisite; one early error does not',()=>{
  const low=diagnose(answers('1.11',7));
  assert.equal(low.recommendation.kind,'prerequisite');
  assert.ok(['1.2','F04'].includes(low.recommendation.targetId));
  const early=diagnose(answers('1.11',0,0,1));assert.equal(early.recommendation.kind,'continue');
});
test('Recommendation is anchored to the most recent current pass, independent of array order',()=>{
  const attempts=[...answers('1.11',8,0),...answers('2.2',9,60)];
  const d=diagnose(attempts.reverse());assert.equal(d.latestPassedId,'2.2');assert.equal(d.recommendation.anchorId,'2.2');
  assert.ok(relationships.some(e=>e.type==='prerequisite'&&e.source==='2.2'&&e.target===d.recommendation.targetId));
});
test('Most recent incomplete work is resumed while preserving the previous passed anchor',()=>{
  const d=diagnose([...answers('1.11'),...answers('1.12',2,60,3)]);
  assert.equal(d.latestPassedId,'1.11');assert.equal(d.recommendation.targetId,'1.12');assert.equal(d.recommendation.kind,'continue');
});
test('Repeated answers cannot pass a concept; latest wrong retries can revoke a previous pass',()=>{
  const attempts=answers('1.11');
  attempts.push(attempt(questions,'1.11',0,false,30));
  const d=diagnose(attempts);assert.equal(d.nodes.get('1.11').status,'review');assert.equal(d.latestPassedId,null);
  const repeats=Array.from({length:15},(_,i)=>attempt(questions,'1.11',0,true,i));
  assert.equal(diagnose(repeats).nodes.get('1.11').status,'partial');
});
test('Correcting a missed answer updates the pass and the next recommendation',()=>{
  const attempts=answers('1.11',7);attempts.push(attempt(questions,'1.11',7,true,30));
  const d=diagnose(attempts);assert.equal(d.recommendation.kind,'advance');assert.equal(d.latestPassedId,'1.11');
});
test('Known prerequisite gaps are traced to the first untested ancestor',()=>{
  const d=mini([...sample('B',4,0),...sample('C',3,60)]);
  assert.equal(d.recommendation.targetId,'A');assert.deepEqual(d.recommendation.path,['C','B','A']);
  assert.equal(d.nodes.get('A').status,'unseen');
});
test('Passing a prerequisite returns to the dependent gap rather than marking it fixed',()=>{
  const d=mini([...sample('B',4,0),...sample('A',9,60)]);
  assert.equal(d.recommendation.targetId,'B');assert.equal(d.recommendation.kind,'revisit');
  assert.equal(d.nodes.get('B').status,'review');
});
test('A confirmed gap at a foundation does not trap the diagnostic in immediate repeats',()=>{
  const d=mini(sample('A',3));
  assert.equal(d.recommendation.kind,'explore');assert.notEqual(d.recommendation.targetId,'A');
  assert.equal(d.nodes.get('A').status,'review');
});
test('Forward search crosses passed nodes and ignores non-prerequisite relationships',()=>{
  const d=mini([...sample('B',8,0),...sample('D',8,30),...sample('A',8,60)]);
  assert.equal(d.recommendation.targetId,'C');assert.deepEqual(d.recommendation.path,['A','B','C']);
  assert.notEqual(d.recommendation.targetId,'X');
});
test('A dependent with another known prerequisite gap routes to that prerequisite',()=>{
  const d=mini([...sample('D',3,0),...sample('A',8,30),...sample('B',8,60)],[edge('A','D'),edge('D','C'),edge('B','C')]);
  assert.equal(d.recommendation.targetId,'D');assert.equal(d.recommendation.kind,'prerequisite');
});
test('At a terminal passed node the next check explores a nearby unfinished branch',()=>{
  const d=mini([...sample('A'),...sample('B',8,30),...sample('C',8,60)],miniEdges,'AB');
  assert.equal(d.recommendation.kind,'explore');assert.equal(d.recommendation.targetId,'D');
});
test('Course filtering excludes BC-only anchors and targets without deleting their evidence',()=>{
  const attempts=[...answers('1.11'),...answers('10.1',9,60)],ab=diagnose(attempts,'AB'),bc=diagnose(attempts);
  assert.equal(ab.nodes.size,97);assert.equal(ab.latestPassedId,'1.11');assert.equal(bc.latestPassedId,'10.1');
  assert.equal(bc.nodes.get('10.1').status,'passed');assert.equal(ab.nodes.has('10.1'),false);
});
test('Backups, import deduplication, and deletion reproduce or clear diagnostic state',()=>{
  const attempts=answers('1.11'),backup={schemaVersion:1,bankVersion:'1.1.0',attempts};
  const restored=validateBackup(JSON.parse(JSON.stringify(backup)),questions,COMPATIBLE_BANK_VERSIONS);
  assert.deepEqual(diagnose(mergeAttempts(attempts,restored)).recommendation,diagnose(attempts).recommendation);
  assert.equal(diagnose([]).recommendation.kind,'start');
  const old=validateBackup({schemaVersion:1,bankVersion:'1.0.0',attempts:attempts.slice(0,5)},questions,COMPATIBLE_BANK_VERSIONS);
  assert.equal(diagnose(old).recommendation.kind,'continue');
});
test('All passed nodes produce a finished state rather than a repeated recommendation',()=>{
  const d=mini(miniConcepts.flatMap((c,i)=>sample(c.id,8,i*20)));
  assert.equal(d.recommendation.kind,'complete');assert.equal(d.recommendation.targetId,null);
});
test('Empty data has a safe finished state and ordering is deterministic',()=>{
  const d=diagnosticState({concepts:[],relationships:[],questions:[],attempts:[]});assert.equal(d.recommendation.targetId,null);
  const attempts=answers('1.11');assert.deepEqual(diagnose(attempts).recommendation,diagnose([...attempts].reverse()).recommendation);
});
test('Graph recommendation marker preserves mastery shading and exposes diagnostic labels',()=>{
  const d=diagnose(answers('1.11')),target=d.recommendation.targetId;
  const svg=drawGraph(graphLayout(concepts.filter(c=>['1.11',target].includes(c.id)),relationships),units,{progress:d.nodes,recommended:target,selected:target});
  assert.ok(svg.includes('data-recommended="true"'));assert.ok(svg.includes('Recommended next check.'));
  assert.ok(svg.includes('Next check'));assert.ok(svg.includes('Check passed'));assert.ok(svg.includes(`fill="${masteryFill(null)}"`));
});
