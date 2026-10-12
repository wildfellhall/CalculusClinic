import test from 'node:test';
import assert from 'node:assert/strict';
import {CameraAccess,CAMERA_ACCESS_KEY,cameraPreference} from '../src/camera-access.mjs';

function environment(raw=null){
  const memory=new Map(raw===null?[]:[[CAMERA_ACCESS_KEY,JSON.stringify(raw)]]),listeners=[];
  const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
  const status={state:'prompt',addEventListener:(_,fn)=>listeners.push(fn)};
  const env={memory,storage,status,calls:[],stopped:0,revoked:0};
  env.stream=()=>({getTracks:()=>[{stop(){env.stopped++;}}]});
  env.change=state=>{status.state=state;listeners.forEach(fn=>fn());};
  env.options={storage,permissions:{query:async()=>status},mediaDevices:{getUserMedia:async options=>{env.calls.push(options);status.state='granted';return env.stream();}},onRevoke:()=>env.revoked++};
  return env;
}
test('First entry requests video only once, releases the permission stream, and remembers the grant',async()=>{
  const e=environment(),access=new CameraAccess(e.options);assert.equal(access.enabled,true);assert.equal(access.canStart,false);
  await Promise.all([access.initialize(),access.initialize()]);assert.equal(e.calls.length,1);assert.equal(e.calls[0].audio,false);assert.equal(e.stopped,1);assert.equal(access.canStart,true);
  const reload=new CameraAccess(e.options);await reload.initialize();assert.equal(e.calls.length,1);assert.equal(reload.canStart,true);
});
test('Denial is remembered and never automatically reprompted on reload or a browser grant',async()=>{
  const e=environment();e.options.mediaDevices.getUserMedia=async()=>{e.calls.push({});throw Object.assign(new Error(),{name:'NotAllowedError'});};
  const access=new CameraAccess(e.options);await access.initialize();assert.equal(access.enabled,false);assert.equal(e.calls.length,1);
  e.status.state='granted';const reload=new CameraAccess(e.options);await reload.initialize();assert.equal(e.calls.length,1);assert.equal(reload.canStart,false);
});
test('Revoking while a permission prompt is pending stops a late stream and cannot restore access',async()=>{
  const e=environment();let resolve;e.options.mediaDevices.getUserMedia=()=>new Promise(r=>resolve=r);
  const access=new CameraAccess(e.options),pending=access.initialize();await new Promise(r=>setTimeout(r,0));assert.equal(access.pending,true);
  access.revoke();resolve(e.stream());await pending;assert.equal(e.stopped,1);assert.equal(access.enabled,false);assert.equal(access.canStart,false);assert.equal(e.revoked,1);
});
test('Settings can explicitly re-enable revoked access, but external grants alone cannot',async()=>{
  const e=environment(),access=new CameraAccess(e.options);await access.initialize();access.revoke();e.change('granted');assert.equal(access.canStart,false);
  await access.request();assert.equal(access.canStart,true);assert.equal(e.calls.length,2);assert.equal(e.stopped,2);
});
test('Browser-level revocation immediately disables app access, including one-time permission expiry',async()=>{
  for(const state of ['denied','prompt']){
    const e=environment(),access=new CameraAccess(e.options);await access.initialize();e.change(state);
    assert.equal(access.enabled,false);assert.equal(access.canStart,false);assert.equal(e.revoked,1);
    const reload=new CameraAccess(e.options);await reload.initialize();assert.equal(e.calls.length,1);
  }
});
test('Revocation and storage clearing propagate across tabs without re-enabling cameras',async()=>{
  const e=environment(),one=new CameraAccess(e.options);await one.initialize();const two=new CameraAccess(e.options);await two.initialize();one.revoke();two.syncFromStorage();assert.equal(two.canStart,false);
  e.memory.clear();two.syncFromStorage();assert.equal(two.enabled,false);assert.equal(e.calls.length,1);
});
test('Stored opt-outs survive missing Permissions API support and practice backup data',async()=>{
  const e=environment({version:1,enabled:false,asked:true});e.options.permissions={query:async()=>{throw new Error('Unsupported');}};
  const access=new CameraAccess(e.options);await access.initialize();e.memory.set('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:[],cameraEnabled:true}));
  assert.equal(access.canStart,false);assert.equal(e.calls.length,0);await access.request();assert.equal(access.canStart,true);
});
test('Unsupported browsers and unreadable storage fail safely while explicit manual retries remain possible',async()=>{
  const e=environment(),access=new CameraAccess({...e.options,secure:false});await access.initialize();assert.equal(e.calls.length,0);assert.equal(access.enabled,false);assert.ok(access.message.includes('HTTPS'));
  const blocked=new CameraAccess({...e.options,storage:{getItem(){throw new Error();},setItem(){throw new Error();}}});await blocked.initialize();assert.equal(blocked.canStart,false);assert.ok(blocked.storageWarning);await blocked.request();assert.equal(blocked.canStart,true);assert.ok(blocked.storageWarning.includes('visit only'));
});
test('Invalid saved preferences fail closed; only a fresh absent key defaults on',()=>{
  assert.equal(cameraPreference(null,{fresh:true}).enabled,true);assert.equal(cameraPreference(null).enabled,false);
  for(const raw of ['invalid','null','{}','{"version":1,"enabled":"true","asked":true}'])assert.equal(cameraPreference(raw,{fresh:true}).enabled,false);
});
