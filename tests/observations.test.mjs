import test from 'node:test';
import assert from 'node:assert/strict';
import {METRICS,MOVEMENT_MODEL,calibrate,movementVector,frameChange,MovementSummary,selfReport,validateMovement,observationStats,observationColumns} from '../src/observations.mjs';
import {validateAttempts,validateBackup,mergeAttempts,stats,csv} from '../src/core.mjs';
import {questions,BANK_VERSION,COMPATIBLE_BANK_VERSIONS} from '../data/questions.mjs';
import {concepts,relationships} from '../data/curriculum.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {MovementCamera} from '../src/camera.mjs';
const vector=(value=.2)=>Object.fromEntries(METRICS.map(({id})=>[id,value]));
const baseline=()=>calibrate(Array.from({length:30},()=>vector()),'reference-test');
const sample=(value=.5,n=4)=>{const s=new MovementSummary(baseline());for(let i=0;i<n;i++)s.add(vector(value),i*200);return s.finish();};
const attempt=(q=questions[0],id='test')=>({id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-12T12:00:00.000Z',sessionId:'test',durationMs:10000});

test('Facial coefficients are observable signals, with missing and invalid data excluded',()=>{
  const categories=METRICS.map(({id})=>({categoryName:id,score:.2}));
  assert.deepEqual(movementVector(categories),vector());
  assert.equal(movementVector(categories.slice(1)),null);
  assert.equal(movementVector([...categories.slice(1),{categoryName:METRICS[0].id,score:NaN}]),null);
});
test('Resting calibration uses the individual median and rejects insufficient or unstable samples',()=>{
  const samples=Array.from({length:30},()=>vector(.45));samples[0]=vector(.9);
  const b=calibrate(samples,'personal');assert.equal(b.center.jawOpen,.45);assert.equal(b.noise.jawOpen,.015);
  assert.equal(frameChange(vector(.45),b).score,0);
  assert.throws(()=>calibrate(samples.slice(0,29),'short'));
  assert.throws(()=>calibrate(Array.from({length:30},(_,i)=>vector(i%2?.8:.2)),'unstable'));
});
test('Movement measures both directions, suppresses jitter and never creates emotion labels',()=>{
  const b=baseline();assert.equal(frameChange(vector(.21),b).score,0);
  assert.ok(Math.abs(frameChange(vector(.5),b).score-28.5)<1e-8);
  assert.ok(Math.abs(frameChange(vector(0),b).score-18.5)<1e-8);
  const s=sample();assert.equal(s.changeScore,28.5);assert.equal(s.metrics.jawOpen.meanDelta,.3);
  assert.equal(s.source,'facial-movement');assert.equal(s.model,MOVEMENT_MODEL);
  assert.equal('emotion' in s,false);assert.equal('sentimentScore' in s,false);assert.equal('center' in s,false);
});
test('Too little evidence is unscored and missing frames do not become zeroes or observed time',()=>{
  const s=new MovementSummary(baseline());assert.equal(s.finish(),null);
  s.add(vector(.5),0);s.add(vector(.5),200);assert.equal(s.finish(),null);
  s.add(null,400);s.add(vector(.5),2000);s.add(vector(.5),2200);
  assert.equal(s.finish().observedMs,400);assert.equal(s.finish().changeScore,28.5);
  s.gap();s.add(vector(.5),20000);assert.equal(s.finish().observedMs,400);
});
test('Sentiment comes from the chosen valence and strength, independently of the emotion name',()=>{
  assert.equal(selfReport({emotion:'fear',intensity:4,valence:'unpleasant'}).sentimentScore,-80);
  assert.equal(selfReport({emotion:'fear',intensity:4,valence:'pleasant'}).sentimentScore,80);
  assert.equal(selfReport({emotion:'mixed',intensity:5,valence:'neutral'}).sentimentScore,0);
  for(const invalid of [{emotion:'inferred fear',intensity:3,valence:'unpleasant'},{emotion:'fear',intensity:0,valence:'unpleasant'},{emotion:'fear',intensity:NaN,valence:'neutral'},{emotion:'fear',intensity:2,valence:'unknown'}])assert.throws(()=>selfReport(invalid));
});
test('Negative sentiment exports as a number while formula-like text remains escaped',()=>{
  const result=csv([{sentiment:-80,note:'-80+1'}],['sentiment','note']);
  assert.ok(result.endsWith('"-80","\'-80+1"'));
});
test('Personal observations survive backup validation; legacy records remain compatible',()=>{
  const a={...attempt(),facialMovement:sample(),selfReport:selfReport({emotion:'frustration',intensity:3,valence:'unpleasant'})};
  const restored=validateBackup({schemaVersion:1,bankVersion:BANK_VERSION,attempts:[a,attempt(questions[1],'legacy')]},questions,COMPATIBLE_BANK_VERSIONS);
  assert.deepEqual(restored[0],a);assert.equal(restored[1].selfReport,undefined);
  assert.deepEqual(mergeAttempts(restored,restored),mergeAttempts([],restored));
});
test('Import rejects corrupt movement data and recalculates self-report scores; raw payloads are dropped',()=>{
  const valid=sample();
  for(const fields of [{samples:0},{samples:NaN},{observedMs:-1},{observedMs:999999},{changeScore:101},{peakChangeScore:0},{model:'unknown'},{metrics:{}},{baselineId:''}])assert.throws(()=>validateMovement({...valid,...fields},10000));
  const a={...attempt(),selfReport:{...selfReport({emotion:'anger',intensity:2,valence:'unpleasant'}),sentimentScore:100},facialMovement:{...valid,frames:['private'],landmarks:[1],emotion:'happy'}};
  const clean=validateAttempts([a],questions)[0];assert.equal(clean.selfReport.sentimentScore,-40);
  assert.equal('frames' in clean.facialMovement,false);assert.equal('emotion' in clean.facialMovement,false);
  assert.throws(()=>validateAttempts([{...a,selfReport:{...a.selfReport,source:'camera'}}],questions));
  assert.throws(()=>validateAttempts([{...a,durationMs:1}],questions));
});
test('Node aggregates join by concept, weight movement by samples, and preserve missing versus neutral',()=>{
  const a={...attempt(),facialMovement:sample(.5,4),selfReport:selfReport({emotion:'fear',intensity:4,valence:'unpleasant'})};
  const b={...attempt(questions[0],'b'),facialMovement:sample(.2,8)};
  const c={...attempt(questions[10],'c'),selfReport:selfReport({emotion:'happiness',intensity:5,valence:'pleasant'})};
  const s=observationStats([a,b,c],a.conceptId);
  assert.equal(s.checkIns,1);assert.equal(s.sentimentScore,-80);assert.equal(s.changeScore,9.5);assert.equal(s.movementAttempts,2);
  assert.equal(observationStats([],a.conceptId).changeScore,null);assert.equal(observationStats([],a.conceptId).sentimentScore,null);
  assert.equal(observationColumns(a).sentimentScore,-80);assert.equal(observationColumns(a).jawOpenChangeScore,28.5);
});
test('Check-ins and facial movement cannot change correctness, mastery, passing or recommendations',()=>{
  const qs=questions.filter(q=>q.conceptId==='1.11'),plain=qs.map((q,i)=>attempt(q,String(i)));
  const observed=plain.map(a=>({...a,facialMovement:sample(),selfReport:selfReport({emotion:'fear',intensity:5,valence:'unpleasant'})}));
  assert.deepEqual(stats(plain,qs.map(q=>q.id)),stats(observed,qs.map(q=>q.id)));
  const input={concepts,relationships,questions};
  const before=diagnosticState({...input,attempts:plain}),after=diagnosticState({...input,attempts:observed});
  assert.deepEqual(before.recommendation,after.recommendation);assert.deepEqual(before.summary,after.summary);
  for(const [id,node] of before.nodes){assert.equal(node.status,after.nodes.get(id).status);assert.equal(node.masteryScore,after.nodes.get(id).masteryScore);}
});
test('Camera pauses invalidate in-flight frames; switching questions and stopping clear unsaved measurements',()=>{
  const original=globalThis.document;
  globalThis.document={createElement:()=>({setAttribute(){},pause(){}})};
  try{
    const camera=new MovementCamera();camera.stage='ready';camera.baseline=baseline();
    camera.sync({key:'question-1',active:true,allowed:true});
    camera.summary=new MovementSummary(camera.baseline);camera.summary.add(vector(.5),0);camera.summary.add(vector(.5),200);
    const oldToken=camera.token;
    camera.sync({key:'question-1',active:false,allowed:true});camera.sync({key:'question-1',active:true,allowed:true});
    assert.notEqual(camera.token,oldToken,'A pre-pause frame cannot belong to the resumed collection');
    camera.summary.add(vector(.5),5000);camera.summary.add(vector(.5),5200);assert.equal(camera.summary.finish().observedMs,400);
    camera.sync({key:'question-2',active:true,allowed:true});assert.equal(camera.finish(),null);
    let released=false,terminated=false;camera.stream={getTracks:()=>[{stop(){released=true}}]};camera.worker={terminate(){terminated=true}};
    camera.stop();assert.ok(released&&terminated);assert.equal(camera.baseline,null);assert.equal(camera.summary,null);assert.equal(camera.video.srcObject,null);
  }finally{if(original===undefined)delete globalThis.document;else globalThis.document=original;}
});
