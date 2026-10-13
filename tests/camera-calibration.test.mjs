import test from 'node:test';
import assert from 'node:assert/strict';
import {MovementCamera} from '../src/camera.mjs';
import {METRICS,CALIBRATION_TIMEOUT_MS} from '../src/observations.mjs';

const vector=n=>Object.fromEntries(METRICS.map(({id})=>[id,n]));
const expressions={neutral:1,happy:0,sad:0,angry:0,fearful:0,disgusted:0,surprised:0};
async function withCamera(check){
  const workers=[],tracks=[],originals=new Map();
  const globals={
    document:{createElement:()=>({setAttribute(){},play:async()=>{},pause(){},readyState:2})},
    navigator:{mediaDevices:{getUserMedia:async()=>{
      const track={enabled:true,readyState:'live',stop(){this.readyState='ended';},addEventListener(){}};tracks.push(track);
      return {getTracks:()=>[track],getVideoTracks:()=>[track]};
    }}},
    isSecureContext:true,OffscreenCanvas:class {},createImageBitmap:async()=>({close(){}}),
    Worker:class {
      constructor(){workers.push(this);this.messages=[];}
      postMessage(data){this.messages.push(data);}
      terminate(){this.ended=true;}
      emit(data){this.onmessage({data});}
    }
  };
  for(const [key,value] of Object.entries(globals)){originals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true});}
  const camera=new MovementCamera();
  const sample=(at,value=.2)=>workers.at(-1).emit({type:'sample',token:camera.token,at,values:vector(value),expressions});
  const samples=(start,count,value=.2)=>{for(let i=0;i<count;i++)sample(start+i*200,typeof value==='function'?value(i):value);};
  try{await check({camera,workers,tracks,sample,samples});}
  finally{camera.stop();for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
}

test('Camera startup calibrates automatically and keeps setup frames out of answer summaries',()=>withCamera(async({camera,workers,sample,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();assert.equal(camera.stage,'loading');
  workers[0].emit({type:'ready'});assert.equal(camera.stage,'calibrating');assert.equal(camera.setup,true);
  samples(0,29);assert.equal(camera.baseline,null);assert.equal(camera.finishExpression(),null);
  sample(5800);assert.equal(camera.stage,'ready');assert.equal(camera.setup,false);assert.equal(camera.baseline.center.jawOpen,.2);
  assert.equal(camera.finish(),null,'Resting-face frames must not produce an observation');
  const baselineId=camera.baseline.id;workers[0].emit({type:'ready'});assert.equal(camera.baseline.id,baselineId,'A repeated ready event must not restart calibration');
  samples(6000,3,.6);assert.equal(camera.finishExpression().samples,3);assert.equal(camera.finish().samples,3);
}));

test('Missing, multiple or badly positioned faces retain progress and usable samples',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  samples(0,20);const progress=camera.progress;
  for(const [i,reason] of ['no-face','multiple-faces','position'].entries()){
    workers[0].emit({type:'sample',token:camera.token,at:4000+i*200,values:null,reason});
    assert.equal(camera.stage,'calibrating');assert.equal(camera.progress,progress);assert.equal(camera.baseline,null);
    assert.equal(camera.calibration.frames.length,20);
  }
  samples(4600,9);assert.equal(camera.stage,'calibrating');samples(6400,1);assert.equal(camera.stage,'ready');
  const baseline=camera.baseline;
  workers[0].emit({type:'sample',token:camera.token,at:6600,values:null,reason:'no-face'});
  assert.equal(camera.baseline,baseline);assert.equal(camera.progress,100,'Face loss after calibration cannot reset its completion');
}));

test('Unstable samples settle in a rolling window without resetting progress or weakening the stability check',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  samples(0,30,i=>i%2?.8:.2);assert.equal(camera.stage,'calibrating');assert.equal(camera.setup,true);assert.equal(camera.progress,99);assert.equal(camera.baseline,null);
  for(let i=30;i<60;i++){
    samples(i*200,1,i%2?.8:.2);assert.equal(camera.progress,99);assert.equal(camera.baseline,null);
    assert.equal(camera.calibration.frames.length,30,'Memory stays bounded while the face is moving');
  }
  samples(12000,30);assert.equal(camera.stage,'ready');assert.equal(camera.baseline.center.jawOpen,.2);
}));

test('A focus pause keeps partial calibration, excludes time away and ignores stale frames',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,20);
  const token=camera.token,progress=camera.progress;camera.sync({key:'q1',active:false,allowed:true});assert.equal(tracks[0].enabled,false);
  camera.sync({key:'q1',active:true,allowed:true});assert.equal(tracks[0].enabled,true);
  workers[0].emit({type:'sample',token,at:4000,values:vector(.9),expressions});assert.equal(camera.calibration.frames.length,20);assert.equal(camera.progress,progress);
  samples(100000,9);assert.equal(camera.stage,'calibrating');assert.equal(camera.calibration.elapsed,5400);
  samples(101800,1);assert.equal(camera.stage,'ready');assert.equal(camera.baseline.center.jawOpen,.2);
}));

test('Automatic camera pauses release the stream but reuse the reference; explicit stop discards it',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,30);
  const baseline=camera.baseline;
  camera.sync({key:null,active:false,allowed:false});assert.equal(camera.stage,'off');assert.equal(camera.baseline,baseline);assert.equal(tracks[0].readyState,'ended');assert.equal(workers[0].ended,true);
  workers[0].emit({type:'ready'});assert.equal(camera.stage,'off');
  camera.sync({key:'q2',active:true,allowed:true});await camera.start();workers[1].emit({type:'ready'});assert.equal(camera.stage,'ready');assert.equal(camera.baseline,baseline);
  samples(6000,10);const token=camera.token;camera.stop();
  workers[1].emit({type:'sample',token,at:8000,values:vector(.2),expressions});assert.equal(camera.stage,'off');assert.equal(camera.baseline,null);assert.equal(camera.finish(),null);assert.equal(tracks[1].readyState,'ended');
  camera.sync({key:'q3',active:true,allowed:true});await camera.start();workers[2].emit({type:'ready'});assert.equal(camera.stage,'calibrating');assert.equal(camera.progress,0);
}));

test('Onboarding calibration is reused across practice visits without turning setup into answer evidence',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:null,active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,30);
  assert.equal(camera.stage,'ready');const baseline=camera.baseline;
  samples(6000,8,.6);assert.equal(camera.finish(),null);assert.equal(camera.finishExpression(),null);
  camera.sync({key:null,active:false,allowed:false});assert.equal(tracks[0].readyState,'ended');
  camera.sync({key:'first-question',active:true,allowed:true});await camera.start();workers[1].emit({type:'ready'});
  assert.equal(camera.stage,'ready');assert.equal(camera.setup,false);assert.equal(camera.baseline,baseline);
  samples(10000,3,.6);assert.equal(camera.finish().baselineId,baseline.id);
  camera.sync({key:null,active:false,allowed:false});camera.sync({key:'later-session',active:true,allowed:true});await camera.start();workers[2].emit({type:'ready'});assert.equal(camera.stage,'ready');
  assert.equal(camera.finish(),null);assert.equal(camera.baseline.id,baseline.id);
  camera.beginCalibration();assert.equal(camera.baseline,null);assert.equal(camera.progress,0);assert.equal(camera.stage,'calibrating');
  samples(20000,30,.4);assert.equal(camera.baseline.center.jawOpen,.4);assert.notEqual(camera.baseline.id,baseline.id);
}));

test('Inference slower than 750 ms still completes a stable 30-sample calibration',()=>withCamera(async({camera,workers,sample})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  for(let i=0;i<29;i++)sample(i*1200);
  assert.equal(camera.stage,'calibrating');assert.equal(camera.calibration.frames.length,29);
  sample(29*1200);assert.equal(camera.stage,'ready');assert.equal(camera.progress,100);assert.equal(camera.finish(),null);
}));

test('Switching tabs during calibration resumes its samples after releasing the camera',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,20);
  const progress=camera.progress,token=camera.token;
  camera.sync({key:'q1',active:false,allowed:false});assert.equal(tracks[0].readyState,'ended');
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[1].emit({type:'ready'});
  assert.equal(camera.stage,'calibrating');assert.equal(camera.progress,progress);
  workers[0].emit({type:'sample',token,at:100000,values:vector(.9),expressions});assert.equal(camera.calibration.frames.length,20);
  samples(100000,10);assert.equal(camera.stage,'ready');assert.equal(camera.baseline.center.jawOpen,.2);
}));

for(const mode of ['no-face','unstable'])test(`${mode} calibration ends with a manual retry instead of an endless loop`,()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  for(let i=0;i<=CALIBRATION_TIMEOUT_MS/200;i++)workers[0].emit({type:'sample',token:camera.token,at:i*200,values:mode==='no-face'?null:vector(i%2?.8:.2),reason:'no-face'});
  assert.equal(camera.stage,'uncalibrated');assert.equal(camera.setup,false);assert.equal(camera.baseline,null);assert.match(camera.message,/Try calibration again/);
  const retryMessage=camera.message;samples(CALIBRATION_TIMEOUT_MS+200,35);assert.equal(camera.stage,'uncalibrated');assert.equal(camera.message,retryMessage);
  camera.sync({key:'q1',active:false,allowed:false});camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[1].emit({type:'ready'});
  assert.equal(camera.stage,'uncalibrated','Tab changes must not restart an expired calibration');assert.equal(camera.message,retryMessage);
  camera.beginCalibration();assert.equal(camera.progress,0);samples(100000,30);assert.equal(camera.stage,'ready');
}));

test('Frame requests skip expression inference during calibration and enable it for answer observations',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:null,active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  await camera.capture();assert.equal(workers[0].messages.at(-1).includeExpressions,false);
  samples(0,30);assert.equal(camera.stage,'ready');
  await camera.capture();assert.equal(workers[0].messages.at(-1).includeExpressions,false,'Onboarding has no answer observations');
  camera.sync({key:'q1',active:true,allowed:true});workers[0].emit({type:'sample',token:camera.token-1,at:6000,values:vector(.2)});
  await camera.capture();assert.equal(workers[0].messages.at(-1).includeExpressions,true);
}));
