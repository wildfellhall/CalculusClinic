import test from 'node:test';
import assert from 'node:assert/strict';
import {MovementCamera} from '../src/camera.mjs';
import {METRICS} from '../src/observations.mjs';

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
      constructor(){workers.push(this);}
      postMessage(){}
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

test('Missing, multiple or badly positioned faces restart the sample window automatically',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  for(const reason of ['no-face','multiple-faces','position']){
    samples(0,20);
    workers[0].emit({type:'sample',token:camera.token,at:4000,values:null,reason});
    assert.equal(camera.stage,'calibrating');assert.equal(camera.progress,0);assert.equal(camera.baseline,null);
  }
  samples(5000,29);assert.equal(camera.stage,'calibrating');samples(10800,1);assert.equal(camera.stage,'ready');
}));

test('Unstable resting samples retry automatically until a stable reference is available',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});
  samples(0,30,i=>i%2?.8:.2);assert.equal(camera.stage,'calibrating');assert.equal(camera.setup,true);assert.equal(camera.progress,0);assert.equal(camera.baseline,null);assert.match(camera.message,/restarting automatically/);
  samples(6000,30);assert.equal(camera.stage,'ready');assert.equal(camera.baseline.center.jawOpen,.2);
}));

test('A focus pause discards partial calibration and ignores frames captured before the pause',()=>withCamera(async({camera,workers,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,20);
  const token=camera.token;camera.sync({key:'q1',active:false,allowed:true});camera.sync({key:'q1',active:true,allowed:true});
  workers[0].emit({type:'sample',token,at:4000,values:vector(.9),expressions});assert.equal(camera.calibrationFrames.length,0);
  samples(5000,20);assert.equal(camera.stage,'calibrating');samples(9000,10);assert.equal(camera.stage,'ready');
}));

test('Stopping discards the reference; reopening calibrates automatically and late frames cannot revive it',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:'q1',active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,30);
  camera.sync({key:null,active:false,allowed:false});assert.equal(camera.stage,'off');assert.equal(camera.baseline,null);assert.equal(tracks[0].readyState,'ended');assert.equal(workers[0].ended,true);
  workers[0].emit({type:'ready'});assert.equal(camera.stage,'off');
  camera.sync({key:'q2',active:true,allowed:true});await camera.start();workers[1].emit({type:'ready'});assert.equal(camera.stage,'calibrating');
  samples(6000,10);const token=camera.token;camera.stop();
  workers[1].emit({type:'sample',token,at:8000,values:vector(.2),expressions});assert.equal(camera.stage,'off');assert.equal(camera.baseline,null);assert.equal(camera.finish(),null);assert.equal(tracks[1].readyState,'ended');
}));

test('Onboarding calibrates without question evidence and hands its in-memory reference to first practice',()=>withCamera(async({camera,workers,tracks,samples})=>{
  camera.sync({key:null,active:true,allowed:true});await camera.start();workers[0].emit({type:'ready'});samples(0,30);
  assert.equal(camera.stage,'ready');const baseline=structuredClone(camera.baseline);
  samples(6000,8,.6);assert.equal(camera.finish(),null);assert.equal(camera.finishExpression(),null);
  camera.stop();assert.equal(tracks[0].readyState,'ended');assert.equal(camera.baseline,null);
  camera.sync({key:'first-question',active:true,allowed:true});await camera.start({baseline});workers[1].emit({type:'ready'});
  assert.equal(camera.stage,'ready');assert.equal(camera.setup,false);assert.deepEqual(camera.baseline,baseline);assert.notEqual(camera.baseline,baseline);
  samples(10000,3,.6);assert.equal(camera.finish().baselineId,baseline.id);
  camera.stop();camera.sync({key:'later-session',active:true,allowed:true});await camera.start();workers[2].emit({type:'ready'});assert.equal(camera.stage,'calibrating');
}));
