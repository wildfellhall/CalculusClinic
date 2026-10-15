import test from 'node:test';
import assert from 'node:assert/strict';
import {concepts,relationships,questions,archivedQuestions} from '../data/catalog.mjs';
import {conceptReportData} from '../src/concept-report-data.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {selfReport} from '../src/observations.mjs';
const qs=questions.filter(q=>q.conceptId==='1.6'),old=archivedQuestions.find(q=>q.conceptId==='1.6');
const attempt=(q,n,correct=true,durationMs=90000)=>({id:'try-'+n,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,14,0,n)).toISOString(),sessionId:n<10?'first':'retry',...(durationMs===null?{}:{durationMs})});
const report=(attempts,extra={})=>conceptReportData({conceptId:'1.6',concepts,relationships,questions,archivedQuestions,attempts,...extra});
test('Concept report preserves exact earlier questions and every retry without mixing them into current accuracy',()=>{
 assert.ok(old);const records=[attempt(qs[0],1,false),attempt(qs[0],12,true),attempt(old,0,false),attempt(qs[1],2,true),attempt(questions.find(q=>q.conceptId==='1.11'),3)],copy=structuredClone(records),r=report(records);
 assert.equal(r.history.length,4);assert.equal(r.archivedAttemptCount,1);assert.equal(r.row.accuracy,.2);assert.equal(r.items.length,11);assert.equal(r.items[0].attempts[0].correct,false);assert.equal(r.items[0].attempts[1].correct,true);assert.equal(r.items[0].stats.firstAccuracy,0);assert.equal(r.items[0].stats.latestAccuracy,1);
 assert.deepEqual(r.items.at(-1).question,old);assert.deepEqual(records,copy);assert.equal(r.sessions.length,2);assert.equal(r.items[0].attempts[1].setLabel,'Set 2');
});
test('Timing distinguishes zero from missing, includes retries, and separates correct/incorrect answers',()=>{
 const r=report([attempt(qs[0],1,true,0),attempt(qs[1],2,false,120000),attempt(qs[0],3,true,null)]);
 assert.deepEqual(r.timing,{count:2,missing:1,total:120000,average:60000,median:60000,fastest:0,slowest:120000,correctAverage:0,incorrectAverage:120000});
 assert.equal(r.items[2].attempts.length,0);assert.equal(report([]).timing.total,null);
});
test('Concept report copies scoring preferences, camera estimates, check-ins, scratch drawing and reflections without mutating their sources',()=>{
 const summary=new ExpressionSummary('baseline');for(let i=0;i<4;i++)summary.add(Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k==='fearful'?1:0])),100,i*200);
 const a={...attempt(qs[0],1),facialExpression:summary.finish(),selfReport:selfReport({emotion:'fear',intensity:5,valence:'unpleasant'})};
 const scratch={strokes:[{tool:'pen',color:'#294637',width:5,points:[[10,20],[30,40]]}],saved:false},check={id:'set1',conceptId:'1.6',completedAt:a.answeredAt,status:'completed',note:'Recheck the factors'};
 const off=report([a]),on=report([a],{preferences:{includeSelfReports:true},scratch,progressChecks:[check],notes:'A note'});
 assert.equal(on.row.emotions,0);assert.equal(off.row.combined,.08);assert.equal(on.row.combined,.078);assert.equal(on.observations.checkIns,1);assert.equal(on.progressChecks.length,1);on.scratch.strokes[0].points[0][0]=50;assert.equal(scratch.strokes[0].points[0][0],10);assert.equal(on.notes,'A note');
});
test('Question-bank version mismatch fails instead of silently substituting another prompt; missing observations stay absent',()=>{
 assert.throws(()=>report([{...attempt(qs[0],1),bankVersion:'unknown'}]),/unavailable/);
 const r=report([attempt(qs[0],1)]);assert.equal(r.row.emotions,null);assert.equal(r.observations.changeScore,null);assert.equal(r.items[0].attempts[0].facialExpression,undefined);
});
test('Per-node reports work for Algebra and shared subset foundations and reject unrelated nodes',()=>{
 const algebra=concepts.find(c=>c.curriculum==='algebra');
 const r=conceptReportData({conceptId:algebra.id,concepts,relationships,questions,archivedQuestions,attempts:[],course:'ALG1'});assert.equal(r.items.length,10);assert.equal(r.row.accuracy,null);
 assert.throws(()=>conceptReportData({conceptId:'9.1',concepts,relationships,questions,attempts:[],course:'AB'}));
 const shared=report([],{course:'CALC_SUBSET'});assert.equal(shared.concept.id,'1.6');assert.ok(shared.connections.some(e=>e.concept.curriculum==='algebra'));
});
