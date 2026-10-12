import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestionClock,timedCredit,formatDuration,TIMING_POLICY} from '../src/timing.mjs';
import {stats,validateAttempts,validateBackup,mergeAttempts} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {graphLayout,drawGraph,masteryFill} from '../src/graph.mjs';
import {concepts,relationships,units} from '../data/curriculum.mjs';
import {questions,COMPATIBLE_BANK_VERSIONS} from '../data/questions.mjs';
const items=questions.filter(q=>q.conceptId==='1.11'),ids=items.map(q=>q.id);
const record=(index,correct=true,durationMs,time=index)=>{
  const q=items[index];return {id:`timed-${index}-${time}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,0,time)).toISOString(),sessionId:'timing-test',...(durationMs===undefined?{}:{durationMs})};
};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`${a} should equal ${b}`);

test('Timing gives no extra reward for rushing within two minutes',()=>{
  for(const durationMs of [0,1,30_000,119_999,120_000])assert.equal(timedCredit({correct:true,durationMs}),1);
});
test('Time adjustment is gradual and capped at 3% of correct-answer credit',()=>{
  near(timedCredit({correct:true,durationMs:210_000}),.985);
  for(const durationMs of [300_000,900_000,Number.MAX_SAFE_INTEGER])near(timedCredit({correct:true,durationMs}),.97);
  let prior=1;for(let durationMs=120_000;durationMs<=600_000;durationMs+=1000){const value=timedCredit({correct:true,durationMs});assert.ok(value<=prior&&value>=.97);prior=value;}
});
test('Fast incorrect answers and unanswered questions cannot earn timing credit',()=>{
  assert.equal(timedCredit({correct:false,durationMs:0}),0);
  const s=stats([record(0,false,0)],ids);assert.equal(s.masteryScore,0);assert.equal(stats([],ids).masteryScore,null);
  near(stats([record(0,true,600_000)],ids).masteryScore,.097);
});
test('Even the maximum timing adjustment cannot outweigh another correct answer',()=>{
  const slow=stats(items.map((_,i)=>record(i,i<9,600_000)),ids);
  const fast=stats(items.map((_,i)=>record(i,i<8,1000)),ids);
  near(slow.masteryScore,.873);near(fast.masteryScore,.8);assert.ok(slow.masteryScore>fast.masteryScore);
  assert.equal(slow.latestAccuracy,.9);assert.equal(slow.firstAccuracy,.9);
});
test('Concept mastery loses at most three percentage points, even for very long responses',()=>{
  const s=stats(items.map((_,i)=>record(i,true,36_000_000)),ids);
  near(s.correctnessScore,1);near(s.masteryScore,.97);near(s.timingAdjustment,.03);
});
test('Half-point mastery values round consistently after accumulating timed credits',()=>{
  const s=stats(items.map((_,i)=>record(i,true,210_000)),ids);
  assert.equal(s.masteryScore,.985);assert.equal(Math.round(s.masteryScore*100),99);
});
test('Legacy attempts with unknown duration retain their previous mastery',()=>{
  const old=items.map((_,i)=>record(i,i<8));
  assert.equal(stats(old,ids).masteryScore,.8);assert.equal(stats(old,ids).timedAttempts,0);
  assert.equal(stats(old,ids).averageDurationMs,null);assert.equal(timedCredit({correct:true,durationMs:null}),1);
});
test('Latest retry time changes mastery without averaging away old accuracy or adding credit',()=>{
  const first=record(0,true,600_000),retry=record(0,true,45_000,60);
  near(stats([first],ids).masteryScore,.097);near(stats([retry,first],ids).masteryScore,.1);
  const s=stats([retry,first],[items[0].id]);assert.equal(s.latestDurationMs,45_000);assert.equal(s.averageDurationMs,322_500);
  assert.equal(s.firstAccuracy,1);assert.equal(s.total,2);assert.equal(s.attempted,1);
});
test('Response-time summaries exclude unknown times and retain recorded zero',()=>{
  const s=stats([record(0,true),record(0,true,0,30),record(0,false,60_000,60)],[items[0].id]);
  assert.equal(s.timedAttempts,2);assert.equal(s.averageDurationMs,30_000);assert.equal(s.latestDurationMs,60_000);
  assert.equal(stats([record(0,true,0)],[items[0].id]).latestDurationMs,0);
});
test('Attempt validation preserves measured durations and rejects invalid response times',()=>{
  for(const durationMs of [0,42,300_000])assert.equal(validateAttempts([record(0,true,durationMs)],questions)[0].durationMs,durationMs);
  for(const durationMs of [-1,.25,'100',false,{},NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>validateAttempts([record(0,true,durationMs)],questions),/response time/);
  assert.ok(!('durationMs' in validateAttempts([record(0,true,null)],questions)[0]));
});
test('Mixed timed and legacy backup records survive round trips and deduplication',()=>{
  const attempts=[record(0,true),record(1,true,210_000),record(2,false,65_000)];
  const restored=validateBackup(JSON.parse(JSON.stringify({schemaVersion:1,bankVersion:'1.1.0',attempts})),questions,COMPATIBLE_BANK_VERSIONS);
  assert.deepEqual(restored,attempts);assert.deepEqual(mergeAttempts(restored,restored),restored);
  near(stats(restored,ids).masteryScore,stats(attempts,ids).masteryScore);
});
test('Eight slow correct answers still pass and receive the same next-node recommendation',()=>{
  const timed=items.map((_,i)=>record(i,i<8,600_000)),old=items.map((_,i)=>record(i,i<8));
  const diagnose=attempts=>diagnosticState({concepts,relationships,questions,attempts});
  const result=diagnose(timed);near(result.nodes.get('1.11').masteryScore,.776);
  assert.equal(result.nodes.get('1.11').status,'passed');assert.deepEqual(result.recommendation,diagnose(old).recommendation);
});
test('Graph color reflects time-adjusted mastery while the answer count stays intact',()=>{
  const attempts=items.map((_,i)=>record(i,i<8,600_000)),diagnostic=diagnosticState({concepts,relationships,questions,attempts});
  const svg=drawGraph(graphLayout(concepts.filter(c=>c.id==='1.11'),[]),units,{progress:diagnostic.nodes});
  assert.ok(svg.includes('data-mastery="78"'));assert.ok(svg.includes(`fill="${masteryFill(.776)}"`));
  assert.ok(svg.includes('8 of 10 latest answers correct'));assert.ok(svg.includes('Check passed'));assert.ok(svg.includes('response-time adjustment'));
});
test('Question clock counts active time and excludes pauses and feedback reading',()=>{
  let now=0;const clock=new QuestionClock(()=>now);
  clock.select('q1');clock.setRunning(true);now=25_000;assert.equal(clock.elapsed(),25_000);
  clock.setRunning(false);now=100_000;assert.equal(clock.elapsed(),25_000);
  clock.setRunning(true);now=115_000;assert.equal(clock.finish(),40_000);
  now=500_000;assert.equal(clock.elapsed(),40_000);assert.equal(clock.running,false);
});
test('Repeated renders do not reset or double-start a question timer',()=>{
  let now=0;const clock=new QuestionClock(()=>now);clock.select('q1');clock.setRunning(true);
  now=1000;clock.select('q1');clock.setRunning(true);now=2500;assert.equal(clock.elapsed(),2500);
  clock.setRunning(false);clock.setRunning(false);now=5000;assert.equal(clock.elapsed(),2500);
});
test('Next questions and explicit retries begin at zero; deleted clocks cannot restart alone',()=>{
  let now=0;const clock=new QuestionClock(()=>now);clock.select('q1');clock.setRunning(true);now=10_000;
  clock.select('q2');assert.equal(clock.elapsed(),0);clock.setRunning(true);now=12_000;assert.equal(clock.elapsed(),2000);
  clock.reset();clock.select('q2');assert.equal(clock.elapsed(),0);
  clock.reset();clock.setRunning(true);assert.equal(clock.running,false);assert.equal(clock.elapsed(),0);
});
test('Clock tolerates a backward time sample and duration labels handle hours and unknown values',()=>{
  let now=1000;const clock=new QuestionClock(()=>now);clock.select('q');clock.setRunning(true);now=900;assert.equal(clock.finish(),0);
  assert.equal(formatDuration(0),'0:00');assert.equal(formatDuration(65_999),'1:05');assert.equal(formatDuration(3_661_000),'1:01:01');
  assert.equal(formatDuration(null),'Not recorded');assert.equal(formatDuration(undefined),'Not recorded');
});
