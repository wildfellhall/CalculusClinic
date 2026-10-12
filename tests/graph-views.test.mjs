import test from 'node:test';
import assert from 'node:assert/strict';
import {GRAPH_MODES,normalizeGraphMode,graphViewProgress,MOVEMENT_SCALE,movementWidth} from '../src/graph-views.mjs';
import {graphLayout,drawGraph,masteryFill} from '../src/graph.mjs';
import {stats,validateAttempts} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {METRICS,calibrate,MovementSummary,selfReport} from '../src/observations.mjs';
import {concepts,relationships,units} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';
const concept=concepts.find(c=>c.id==='1.11'),items=questions.filter(q=>q.conceptId===concept.id);
const answer=(i,correct=true)=>({id:'a'+i,questionId:items[i].id,conceptId:concept.id,bankVersion:items[i].version,choiceId:correct?items[i].correctOptionId:items[i].options.find(o=>o.id!==items[i].correctOptionId).id,correct,sessionId:'views',answeredAt:new Date(Date.UTC(2026,9,12,12,i)).toISOString(),durationMs:600000});
const expression=(key='sad',move=100)=>{const s=new ExpressionSummary('baseline');for(let i=0;i<4;i++)s.add(Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k===key?1:0])),move,i*200);return s.finish();};
const movement=()=>{const vector=n=>Object.fromEntries(METRICS.map(m=>[m.id,n])),s=new MovementSummary(calibrate(Array.from({length:30},()=>vector(.2)),'baseline'));for(let i=0;i<4;i++)s.add(vector(.5),i*200);return s.finish();};
const nodes=a=>new Map([[concept.id,{...stats(a,items.map(q=>q.id)),status:'partial'}]]);
const view=(a,mode)=>graphViewProgress(nodes(a),a,mode).get(concept.id).display;
const svg=(a,mode,standalone=false)=>{const progress=graphViewProgress(nodes(a),a,mode);return drawGraph(graphLayout([concept],[],{progress}),units,{progress,fillMode:mode,standalone,selected:concept.id});};
test('Exactly three graph views retain persisted values and default unknown modes to accuracy',()=>{
  assert.deepEqual(Object.keys(GRAPH_MODES),['accuracy','combined','movement']);for(const mode of Object.keys(GRAPH_MODES))assert.equal(normalizeGraphMode(mode),mode);
  for(const mode of [null,undefined,'__proto__',''])assert.equal(normalizeGraphMode(mode),'accuracy');
});
test('Accuracy excludes camera estimates and time while adjusted accuracy exposes the capped change',()=>{
  const a={...answer(0),facialExpression:expression('fearful')};
  assert.equal(nodes([a]).get(concept.id).masteryScore,.097);assert.equal(view([a],'accuracy').score,.1);
  assert.ok(Math.abs(view([a],'combined').score-.08)<1e-12);assert.equal(view([a],'combined').accuracy,.1);
  assert.equal(view([{...a,correct:false}],'combined').score,0);assert.equal(view([],'combined').score,null);
});
test('Missing estimates preserve accuracy and stay blank in camera-only mode; neutral evidence is distinct',()=>{
  const absent=[{...answer(0),facialMovement:movement()}],neutral=[{...answer(0),facialExpression:expression('neutral')}];
  assert.equal(view(absent,'combined').score,.1);assert.equal(view(absent,'movement').score,null);
  assert.equal(view(neutral,'movement').score,1);assert.equal(view(neutral,'combined').score,.1);
});
test('Self-reports have zero influence on graph scores, camera labels and shading',()=>{
  const a={...answer(0),facialExpression:expression()};
  const positive={...a,selfReport:selfReport({emotion:'happiness',intensity:1,valence:'pleasant'})},negative={...a,selfReport:selfReport({emotion:'fear',intensity:5,valence:'unpleasant'})};
  for(const mode of Object.keys(GRAPH_MODES))assert.deepEqual(view([positive],mode),view([negative],mode));
  assert.ok(!svg([{...answer(0),selfReport:negative.selfReport}],'combined').includes('node-checkin'));
});
test('Saved camera labels identify estimates and survive all three SVG export modes',()=>{
  for(const key of Object.keys(EXPRESSION_LABELS))for(const mode of Object.keys(GRAPH_MODES)){
    const a=validateAttempts([{...answer(0),facialExpression:expression(key)}],questions),out=svg(a,mode,true);
    assert.ok(out.includes(`Est. ${EXPRESSION_LABELS[key]} · 100%`));assert.ok(out.includes('data-emotion-source="camera-expression"'));
    assert.ok(out.includes(mode==='combined'?'Experimental adjusted accuracy':mode==='movement'?'Camera estimates only':'Accuracy: latest correct answers'));
  }
});
test('Movement stays a separate border, and cannot create a camera emotion label on its own',()=>{
  const a={...answer(0),facialMovement:movement()};assert.ok(svg([a],'combined').includes('node-movement-border'));
  assert.ok(!svg([a],'combined').includes('node-checkin'));assert.equal(view([a],'combined').score,.1);
});
test('Camera estimates never change passing, recommendation, raw mastery or original records',()=>{
  const attempts=items.map((_,i)=>({...answer(i,i<8),facialExpression:expression('angry')})),d=diagnosticState({concepts,relationships,questions,attempts}),before=structuredClone(d);
  for(const mode of Object.keys(GRAPH_MODES)){const changed=graphViewProgress(d.nodes,attempts,mode);assert.equal(changed.get(concept.id).status,'passed');assert.equal(changed.get(concept.id).masteryScore,.776);}
  assert.deepEqual(d,before);
});
test('Invalid camera sources cannot color a node or manufacture an emotion',()=>{
  const a={...answer(0),facialExpression:{...expression(),source:'self-report'}};assert.equal(view([a],'movement').score,null);assert.equal(view([a],'combined').expression,null);
});
test('Camera label rows reserve room without overlapping neighboring cards on desktop or mobile',()=>{
  const records=concepts.map((c,i)=>({...answer(0),id:String(i),conceptId:c.id,facialExpression:expression('surprised')}));
  const progress=graphViewProgress(new Map(concepts.map(c=>[c.id,{...stats([],[]),status:'unseen'}])),records,'combined');
  for(const options of [{},{focus:'1.11',compact:true}]){
    const base=graphLayout(concepts,relationships,options),layout=graphLayout(concepts,relationships,{...options,progress});
    for(const n of layout.nodes)assert.equal(n.h,base.nodes.find(b=>b.id===n.id).h+24);
    for(let i=0;i<layout.nodes.length;i++)for(const b of layout.nodes.slice(i+1)){const a=layout.nodes[i];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);}
  }
});
test('Camera fills retain readable text, and movement border widths remain ordered',()=>{
  const luminance=hex=>{const v=hex.match(/[\da-f]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};let last=1;
  for(let i=0;i<=100;i++){const x=luminance(masteryFill(i/100,MOVEMENT_SCALE));assert.ok(x<=last);last=x;assert.ok((x+.05)/(luminance('#294637')+.05)>=4.5);}
  assert.ok(movementWidth(1)>movementWidth(.5)&&movementWidth(.5)>movementWidth(0));
});
