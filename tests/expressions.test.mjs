import test from 'node:test';
import assert from 'node:assert/strict';
import {EXPRESSION_LABELS,ExpressionSummary,expressionVector,expressionLabel,validateExpression,expressionStats,expressionColumns} from '../src/expressions.mjs';
import {stats,validateAttempts} from '../src/core.mjs';
import {questions} from '../data/questions.mjs';
import {MovementCamera} from '../src/camera.mjs';
import {METRICS,calibrate} from '../src/observations.mjs';
const p=(key='neutral',confidence=1)=>Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k===key?confidence:(1-confidence)/6]));
const sample=(key='neutral',move=0,count=4)=>{const x=new ExpressionSummary('baseline');for(let i=0;i<count;i++)x.add(p(key),move,i*200);return x.finish();};
const q=questions.find(q=>q.id==='1.11-Q1');
const answer=x=>({id:'a',questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-12T12:00:00.000Z',durationMs:10000,sessionId:'test',...(x?{facialExpression:x}:{})});
test('The classifier retains all seven named classes without inventing frustration',()=>{
  assert.deepEqual(Object.values(EXPRESSION_LABELS),['Neutral','Happiness','Sadness','Anger','Fear','Disgust','Surprise']);
  assert.equal(expressionVector({fearful:1}),null);assert.equal(expressionLabel(p('fearful',.9)).label,'Fear');
  assert.equal(expressionVector({...p(),neutral:2}),null);
});
test('Ambiguous estimates, insufficient evidence and gaps never become a neutral score',()=>{
  const s=new ExpressionSummary('baseline');
  assert.equal(s.add(p('angry',.5),80,0),null);assert.equal(s.finish(),null);
  s.add(p('sad'),0,200);s.add(p('sad'),0,400);assert.equal(s.finish(),null);
  s.gap();s.add(p('sad'),0,5000);assert.equal(s.finish(),null);
  s.add(p('sad'),0,5200);assert.ok(s.finish());assert.equal(s.finish().observedMs,400);
  const nearTie={...p('neutral',0),neutral:.56,happy:.43,sad:.01,angry:0,fearful:0,disgusted:0,surprised:0};assert.equal(expressionLabel(nearTie).label,'Mixed / uncertain');
});
test('Fear, sadness and anger reduce the experimental score with bounded independent weights',()=>{
  for(const key of ['fearful','sad','angry']){
    const ordinary=sample(key,0),excess=sample(key,100);
    assert.equal(ordinary.negativeScore,100);assert.equal(ordinary.sentimentScore,-100);assert.equal(ordinary.adjustment,.15);
    assert.equal(excess.excessMovementScore,100);assert.equal(excess.adjustment,.2);assert.equal(excess.cameraScore,0);
  }
});
test('Movement below the threshold and movement without adverse expressions do not add a penalty',()=>{
  for(const key of ['neutral','happy','surprised','disgusted'])assert.equal(sample(key,100).adjustment,0);
  assert.equal(sample('fearful',20).excessMovementScore,0);
  assert.equal(sample('fearful',60).excessMovementScore,50);assert.equal(sample('fearful',60).adjustment,.175);
  assert.equal(sample('happy',100).sentimentScore,100);
});
test('Excess movement and adverse probability must coincide, rather than be multiplied after averaging',()=>{
  const s=new ExpressionSummary('baseline');
  for(let i=0;i<4;i++)s.add(p(i%2?'happy':'sad'),i%2?100:0,i*200);
  const x=s.finish();assert.equal(x.negativeScore,50);assert.equal(x.excessMovementScore,0);assert.equal(x.adjustment,.075);
});
test('Validation derives scores from probabilities and strips imported frames and claimed labels',()=>{
  const x=sample('angry',60),v=validateExpression({...x,adjustment:0,cameraScore:1,rawImage:'private',emotion:'happy'},10000);
  assert.equal(v.adjustment,.175);assert.equal(v.cameraScore,.125);assert.equal(v.rawImage,undefined);assert.equal(v.emotion,undefined);
  for(const bad of [{...x,source:'self-report'},{...x,samples:2},{...x,observedMs:100000},{...x,probabilities:{...x.probabilities,angry:-1}},{...sample(),excessMovementScore:100}])assert.throws(()=>validateExpression(bad,10000));
});
test('Camera data round trips without changing raw accuracy or timing-based mastery',()=>{
  const a=answer(sample('sad',100)),restored=validateAttempts(JSON.parse(JSON.stringify([a])),questions);
  assert.deepEqual(restored,[a]);assert.deepEqual(stats([a],[q.id]),stats([answer()],[q.id]));
  assert.equal(expressionColumns(a).cameraExpressionSource,'camera-expression');assert.equal(expressionColumns(a).camera_sad,1);
});
test('Node summaries are sample-weighted, ignore self-reports and handle missing or invalid records',()=>{
  const first=answer(sample('sad',100,4)),second={...answer(sample('happy',0,8)),id:'b'};
  const x=expressionStats([first,second],q.conceptId);assert.equal(x.samples,12);assert.ok(Math.abs(x.negativeScore-100/3)<.001);
  assert.equal(expressionStats([{...first,facialExpression:null,selfReport:{emotion:'fear',intensity:5}}],q.conceptId),null);
  assert.equal(expressionStats([{...first,facialExpression:{...first.facialExpression,source:'self-report'}}],q.conceptId),null);
  assert.equal(expressionStats([],q.conceptId),null);
});
test('Camera pauses, question changes, recalibration and stop discard or separate expression samples',()=>{
  const before=globalThis.document;globalThis.document={createElement:()=>({setAttribute(){},pause(){}})};
  try{
    const values=Object.fromEntries(METRICS.map(m=>[m.id,.2])),camera=new MovementCamera();
    camera.stage='ready';camera.baseline=calibrate(Array.from({length:30},()=>values),'baseline');camera.sync({key:'q1',active:true,allowed:true});
    for(let i=0;i<4;i++)camera.receive({values,expressions:p('fearful'),at:i*200});
    assert.equal(camera.finishExpression().probabilities.fearful,1);camera.finish();assert.equal(camera.finishExpression(),null);
    for(let i=0;i<4;i++)camera.receive({values,expressions:p('angry'),at:1000+i*200});
    camera.sync({key:'q2',active:true,allowed:true});assert.equal(camera.finishExpression(),null);
    camera.receive({values,expressions:p('sad'),at:2000});camera.beginCalibration();assert.equal(camera.finishExpression(),null);
    camera.stop();assert.equal(camera.liveExpression,null);assert.equal(camera.expressionSummary,null);
  }finally{globalThis.document=before;}
});
