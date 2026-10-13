import test from 'node:test';
import assert from 'node:assert/strict';
import {concepts,questions,attemptQuestions,archivedQuestions} from '../data/catalog.mjs';
import {createProgressCheck,validateProgressChecks,mergeProgressChecks,checkReady,progressCheckRows,PROGRESS_CHECK_COLUMNS} from '../src/progress-checks.mjs';
import {renderProgressCheck,renderCheckResponse,renderProgressCheckHistory} from '../src/progress-check-ui.mjs';
import {csv,validateAttempts,stats} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
const fixture=(id='1.11',course='BC')=>{
 const list=questions.filter(q=>q.conceptId===id);
 const attempts=list.map((q,i)=>({id:`answer-${q.id}`,questionId:q.id,conceptId:id,bankVersion:q.version,choiceId:i<8?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct:i<8,answeredAt:new Date(Date.UTC(2026,9,13,12,i)).toISOString(),sessionId:'set-1',durationMs:60000}));
 const quiz={conceptId:id,list,results:attempts,sessionId:'set-1'};
 return {attempts,list,quiz,check:createProgressCheck(quiz,attempts,questions,course)};
};
const completed=c=>({...c,status:'completed',ease:2,progress:4,feelings:['confused','focused'],note:'Factoring helped.',submittedAt:'2026-10-13T12:11:00.000Z'});

test('A progress check follows ten answers in every course, never an unfinished set',()=>{
 for(const [id,course] of [['MATH_034','ALG1'],['MATH_078','ALG2'],['1.11','AB'],['10.1','BC'],['1.6','CALC_SUBSET'],['MATH_082','CALC_SUBSET']]){
  const {quiz,attempts,check}=fixture(id,course);
  assert.equal(check.status,'pending');assert.equal(check.course,course);assert.equal(check.attemptIds.length,10);
  assert.deepEqual(validateProgressChecks([check],validateAttempts(attempts,attemptQuestions),concepts),[check]);
  assert.equal(createProgressCheck({...quiz,results:attempts.slice(0,9)},attempts.slice(0,9),questions,course),null);
  assert.equal(createProgressCheck({...quiz,results:[]},attempts,questions,course),null);
 }
});
test('A resumed diagnostic links all ten answers across sessions, and retries make separate checks',()=>{
 const {quiz,attempts,list}=fixture();
 const resumed={...quiz,sessionId:'set-2',list:list.slice(3),results:attempts.slice(3).map(a=>({...a,sessionId:'set-2'}))};
 const check=createProgressCheck(resumed,[...attempts.slice(0,3),...resumed.results],questions,'BC');
 assert.equal(check.id,'set-2');assert.deepEqual(check.attemptIds,attempts.map(a=>a.id));
 const retry={...quiz,sessionId:'set-3',results:attempts.map(a=>({...a,id:'retry-'+a.id,sessionId:'set-3'}))};
 assert.deepEqual(createProgressCheck(retry,[...attempts,...retry.results],questions,'BC').attemptIds,retry.results.map(a=>a.id));
 assert.equal(createProgressCheck(resumed,resumed.results,questions,'BC'),null);
});
test('Completed, skipped, and draft checks round-trip; legacy backups need no checks field',()=>{
 const {attempts,check}=fixture();
 for(const c of [check,{...check,ease:2,note:'Still thinking.'},{...check,status:'skipped'},completed(check)])assert.deepEqual(validateProgressChecks(JSON.parse(JSON.stringify([c])),attempts,concepts),[c]);
 assert.deepEqual(validateProgressChecks(undefined,attempts,concepts),[]);
 assert.equal(checkReady(check),false);assert.equal(checkReady(completed(check)),true);
});
test('Malformed survey data is rejected before any history is merged',()=>{
 const {attempts,check}=fixture();
 const mutations=[c=>c.ease=0,c=>c.ease=6,c=>c.progress=2.5,c=>c.progress='3',c=>c.feelings=['made-up'],c=>c.feelings=['confused','confused'],c=>c.note='x'.repeat(601),c=>c.note={},c=>c.completedAt='tomorrow',c=>c.id='',c=>c.course='ALG1',c=>c.conceptId='missing',c=>c.status='done',c=>c.status='completed',c=>c.attemptIds.pop(),c=>c.attemptIds[0]='missing',c=>c.attemptIds[0]=c.attemptIds[1],c=>c.submittedAt='2026-10-13T12:11:00Z'];
 for(const change of mutations){const c=structuredClone(check);change(c);assert.throws(()=>validateProgressChecks([c],attempts,concepts));}
 assert.throws(()=>validateProgressChecks(null,attempts,concepts));
 assert.throws(()=>validateProgressChecks([check,check],attempts,concepts));
 assert.throws(()=>validateProgressChecks([{...completed(check),submittedAt:null}],attempts,concepts));
 assert.throws(()=>validateProgressChecks([check],[...attempts.slice(0,9),{...attempts[9],questionId:attempts[0].questionId}],concepts));
});
test('Historical sets remain valid when their question wording is retired',()=>{
 const {attempts,check}=fixture();
 const old=archivedQuestions.find(q=>q.id==='1.11-Q1');
 attempts[0]={...attempts[0],questionId:old.id,bankVersion:old.version,choiceId:old.correctOptionId,correct:true};
 assert.deepEqual(validateProgressChecks([check],validateAttempts(attempts,attemptQuestions),concepts),[check]);
});
test('Shrinking a subset preserves earlier surveys without resurfacing removed concepts in its history',()=>{
 for(const id of ['MATH_001','MATH_034','F03']){
  const {attempts,check}=fixture(id,'CALC_SUBSET');
  for(const saved of [check,completed(check)]){
   assert.deepEqual(validateProgressChecks([saved],validateAttempts(attempts,attemptQuestions),concepts),[saved]);
   assert.equal(renderProgressCheckHistory([saved],concepts,'CALC_SUBSET'),'');
  }
 }
});
test('Merging is idempotent, preserves completed responses and upgrades an unfinished check',()=>{
 const {check}=fixture(),done=completed(check),skipped={...check,status:'skipped'};
 assert.deepEqual(mergeProgressChecks([done],[done,check,skipped]),[done]);
 assert.deepEqual(mergeProgressChecks([check],[done]),[done]);
 assert.deepEqual(mergeProgressChecks([skipped],[done]),[done]);
 assert.throws(()=>mergeProgressChecks([check],[{...done,conceptId:'1.12'}]),/different practice set/);
 assert.throws(()=>mergeProgressChecks([check],[{...done,attemptIds:[...done.attemptIds].reverse()}]),/different practice set/);
});
test('Reflections cannot modify accuracy, diagnostic passing, timing, or answer observations',()=>{
 const {attempts,check}=fixture(),before=structuredClone(attempts);
 const input={concepts,questions,relationships:[],attempts,course:'BC'};
 const d=diagnosticState(input).nodes.get('1.11'),s=stats(attempts,questions.filter(q=>q.conceptId==='1.11').map(q=>q.id));
 validateProgressChecks([{...completed(check),ease:1,progress:1,feelings:['frustrated','confused']}],attempts,concepts);
 assert.deepEqual(attempts,before);assert.equal(d.status,'passed');assert.equal(s.latestAccuracy,.8);assert.equal(s.masteryScore,.8);
});
test('Readable CSV labels and safe HTML preserve optional free text',()=>{
 const {check}=fixture(),c={...completed(check),note:'=SUM(1,2)\n<script>alert(1)</script>'};
 const output=csv(progressCheckRows([c]),PROGRESS_CHECK_COLUMNS);
 assert.ok(output.includes('"easeLabel"'));assert.ok(output.includes('"Difficult"'));assert.ok(output.includes('"Steady progress"'));assert.ok(output.includes('"Confused; Focused"'));assert.ok(output.includes('"\'=SUM'));
 assert.ok(renderProgressCheck(c,concepts.find(c=>c.id==='1.11')).includes('&lt;script&gt;'));
 assert.ok(!renderCheckResponse(c).includes('<script>'));
 assert.equal(renderProgressCheckHistory([c],concepts,'ALG1'),'');
 assert.ok(renderProgressCheckHistory([c],concepts,'BC').includes('Progress checks'));
});
