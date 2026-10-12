import test from 'node:test';
import assert from 'node:assert/strict';
import {reportData} from '../src/report-data.mjs';
import {concepts,relationships} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {selfReport} from '../src/observations.mjs';
const expression=()=>{const s=new ExpressionSummary('test');for(let i=0;i<4;i++)s.add(Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k==='fearful'?1:0])),100,i*200);return s.finish();};
const attempt=(q,index,correct=true)=>({id:q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,0,index)).toISOString(),sessionId:'report-test',durationMs:600000});
const fixture=()=>[
  ...questions.filter(q=>q.conceptId==='1.11').map((q,i)=>({...attempt(q,i,i<8),...(i===0?{facialExpression:expression(),selfReport:selfReport({emotion:'fear',intensity:5,valence:'unpleasant'})}:{})})),
  ...questions.filter(q=>q.conceptId==='1.2').map((q,i)=>attempt(q,i,i<5)),
  attempt(questions.find(q=>q.id==='9.1-Q1'),30),
];
const report=(attempts,options={})=>reportData({concepts,relationships,questions,attempts,...options});
test('Report compares scores on matching concepts and separates partial checks from weak skills',()=>{
  const r=report(fixture());assert.deepEqual(r.strengths.map(r=>r.concept.id),['1.11']);assert.deepEqual(r.weak.map(r=>r.concept.id),['1.2']);assert.deepEqual(r.partial.map(r=>r.concept.id),['9.1']);
  assert.equal(r.comparable.count,1);assert.equal(r.comparable.accuracy,.8);assert.equal(r.comparable.emotions,0);assert.equal(r.comparable.combined,.64);
  assert.equal(r.profile.rows.accuracy.count,3);assert.equal(r.profile.rows.movement.count,1);assert.equal(r.differences[0].emotionDelta,-.8);
});
test('Reports apply enabled check-ins only to combined scores and preserve the original history',()=>{
  const records=fixture(),copy=structuredClone(records),off=report(records),on=report(records,{preferences:{includeSelfReports:true}});
  assert.equal(on.comparable.combined,.624);assert.equal(off.comparable.combined,.64);assert.deepEqual(on.strengths.map(r=>r.concept.id),off.strengths.map(r=>r.concept.id));assert.deepEqual(records,copy);
});
test('Report course and map filters are independent, exclude BC-only concepts in AB, and handle missing data',()=>{
  const r=report(fixture(),{course:'AB',mapIds:['1.11','9.1'],mapFocus:'1.11'});
  assert.equal(r.rows.length,97);assert.equal(r.profile.rows.accuracy.count,2);assert.deepEqual(r.map.concepts.map(c=>c.id),['1.11']);assert.deepEqual(r.map.edges,[]);
  const empty=report([]);assert.equal(empty.weak.length,0);assert.equal(empty.strengths.length,0);assert.equal(empty.comparable.count,0);assert.equal(empty.comparable.emotions,null);assert.equal(empty.profile.rows.accuracy.score,null);
});
test('Latest retries update report strength classifications without treating earlier errors as current gaps',()=>{
  const records=fixture(),retries=records.filter(a=>a.conceptId==='1.2'&&!a.correct).map(a=>({...a,id:a.id+'-retry',choiceId:questions.find(q=>q.id===a.questionId).correctOptionId,correct:true,answeredAt:'2026-10-13T00:00:00.000Z'}));
  const r=report([...records,...retries]);assert.equal(r.weak.length,0);assert.equal(r.strengths[0].concept.id,'1.2');assert.equal(r.strengths[0].accuracy,1);assert.equal(r.strengths[0].total,15);
});
