// Run in an isolated Chrome profile on port 9224 with fake media devices only.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {questions} from '../data/catalog.mjs';
import {METRICS} from '../src/observations.mjs';
const appURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<150;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-2000)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value)=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const load=async(method='Page.reload',params={})=>{const before=await run('window.qaDocument??null');await send(method,params);await waitFor(`!!window.qaDocument&&window.qaDocument!==${JSON.stringify(before)}&&document.readyState==='complete'&&!!document.querySelector('.onboarding-main,.explore-home')`);};
const snap=async name=>{await run('document.fonts.ready');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const choice=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-course-v1"))?.course');
const setup=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-onboarding-v1"))');
const fixture=['1.2','9.1'].map(id=>{const q=questions.find(q=>q.conceptId===id);return {id:'onboarding-'+q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-12T12:00:00.000Z',sessionId:'onboarding-qa',durationMs:50000};});
const size=width=>send('Emulation.setDeviceMetricsOverride',{width,height:width<500?844:1100,deviceScaleFactor:1,mobile:width<500});
try{
 await mkdir('test-results',{recursive:true});await send('Page.enable');await send('Runtime.enable');await size(1280);
 await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});
 // Use Chrome's fake video stream and deterministic coefficient fixtures.
 // Production has no QA hook; the real worker is tested in browser-observations-check.
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`
  window.qaDocument=crypto.randomUUID();window.qaMediaCalls=0;window.qaStreams=[];window.qaWorkers=[];window.qaMode='no-face';
  window.qaNativeMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia=async options=>{qaMediaCalls++;const stream=await qaNativeMedia(options);qaStreams.push(stream);return stream;};
  window.Worker=class {
   constructor(){this.ended=false;qaWorkers.push(this);}
   postMessage(data){
    if(data.type==='init'){setTimeout(()=>{if(!this.ended)this.onmessage?.({data:{type:'ready'}})},10);return;}
    data.frame.close();const values=qaMode==='face'?Object.fromEntries(${JSON.stringify(METRICS.map(m=>m.id))}.map(id=>[id,.2])):null;
    setTimeout(()=>{if(!this.ended)this.onmessage?.({data:{type:'sample',token:data.token,at:data.at,values,expressions:{neutral:1,happy:0,sad:0,angry:0,fearful:0,disgusted:0,surprised:0},reason:qaMode==='multiple'?'multiple-faces':'no-face'}})},5);
   }
   terminate(){this.ended=true;}
  };`});
 await load('Page.navigate',{url:appURL});await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 assert.equal(await run('document.querySelectorAll("[data-action=choose-course]").length'),4);assert.equal(await run('qaMediaCalls'),0);assert.equal(await choice(),undefined);await snap('onboarding-courses');
 await run(`document.querySelector('[data-course="AB"]').focus()`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter'});
 await waitFor('!!document.querySelector(".onboarding-tutorial")');assert.equal(await choice(),'AB');assert.equal(await run('qaMediaCalls'),0);
 assert.equal((await setup()).step,'tutorial');assert.match(await run('document.querySelector(".tutorial-lessons").textContent'),/ten problems.*eight correct.*prerequisites.*feelings/s);await snap('onboarding-tutorial-desktop');
 await size(390);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await snap('onboarding-tutorial-mobile');await size(1280);
 await load();assert.equal(await run('!!document.querySelector(".onboarding-tutorial")'),true);assert.equal(await run('qaMediaCalls'),0);
 await click('[data-action="onboarding-camera"]');await waitFor('qaMediaCalls===2&&document.querySelector("#onboarding-camera-message").textContent.includes("No usable face")');
 assert.ok(await run('(await navigator.mediaDevices.enumerateDevices()).some(d=>d.kind==="videoinput"&&d.label.startsWith("fake_device"))'),'Only simulated cameras may be used by QA');
 assert.equal(await run('qaStreams[0].getTracks().every(t=>t.readyState==="ended")'),true);
 assert.equal(await run('qaStreams.every(s=>s.getAudioTracks().length===0)'),true);
 assert.equal(await run('document.querySelector("#onboarding-finish").disabled'),true);
 await run('document.querySelector("#onboarding-finish").dispatchEvent(new MouseEvent("click",{bubbles:true}))');assert.equal(await run('!!document.querySelector(".onboarding-camera")'),true);
 await run('qaMode="multiple"');await waitFor('document.querySelector("#onboarding-camera-message").textContent.includes("More than one face")');assert.equal(await run('document.querySelector("#onboarding-finish").disabled'),true);
 await run('qaMode="face"');await waitFor('document.querySelector("#onboarding-calibration-progress").value>0');await snap('onboarding-calibrating');
 assert.deepEqual(await stored(),[]);assert.equal((await setup()).step,'camera');
 // Reload must resume the camera step and collect a new resting reference.
 await load();assert.equal(await run('!!document.querySelector(".onboarding-camera")'),true);assert.equal(await run('document.querySelector("#onboarding-finish").disabled'),true);
 await run('qaMode="face"');await waitFor('document.querySelector("#onboarding-finish").disabled===false');
 assert.equal(await run('document.querySelector("#onboarding-camera-state").textContent'),'Calibration complete');await snap('onboarding-calibrated');
 assert.deepEqual(await stored(),[]);assert.deepEqual(Object.keys(await setup()).sort(),['step','version']);
 await click('#onboarding-finish');assert.equal(await run('!!document.querySelector(".explore-home")'),true);assert.equal((await setup()).cameraOutcome,'calibrated');
 assert.equal(await run('qaStreams.every(s=>s.getTracks().every(t=>t.readyState==="ended"))&&qaWorkers.every(w=>w.ended)'),true);
 await click('[data-view="graph"]');await change('#graph-scope','all');assert.equal(await run('document.querySelectorAll(".graph-node").length'),97);
 await click('[data-view="practice"]');await change('#practice-concept','1.11');const started=Date.now();await click('[data-action="start-picked"]');
 await waitFor('document.querySelector("#camera-state").textContent==="Camera on"');assert.ok(Date.now()-started<4000,'First practice reuses onboarding calibration instead of collecting another six-second reference');
 await new Promise(r=>setTimeout(r,1000));await click('.answer-options input');await click('[data-action="submit"]');
 assert.equal((await stored()).length,1);assert.ok((await stored())[0].facialMovement);assert.ok((await stored())[0].durationMs<5000);
 await click('[data-view="settings"]');await click('#camera-revoke');await load();assert.equal(await run('!!document.querySelector(".explore-home")'),true);assert.equal(await run('qaMediaCalls'),0);
 console.log('PASS course → tutorial → camera, keyboard choice, permission timing, no/multiple-face gating, interrupted setup resume, real calibration window, private reference handoff, and stopped camera outside practice');

 // Denial and missing hardware leave clear recovery controls and an explicit opt-out.
 await run('localStorage.clear()');await size(320);await load();await click('[data-course="BC"]');
 assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 await run('navigator.mediaDevices.getUserMedia=async()=>{qaMediaCalls++;throw new DOMException("Denied","NotAllowedError")}');
 await click('[data-action="onboarding-camera"]');await waitFor('document.querySelector("#onboarding-camera-message").textContent.includes("not granted")');
 assert.equal(await run('document.querySelector("#onboarding-finish").disabled'),true);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await snap('onboarding-camera-denied-mobile');
 await run('navigator.mediaDevices.getUserMedia=async()=>{qaMediaCalls++;throw new DOMException("Missing","NotFoundError")}');await click('#onboarding-camera-enable');await waitFor('document.querySelector("#onboarding-camera-message").textContent.includes("No camera")');
 await click('[data-action="onboarding-skip-camera"]');assert.equal((await setup()).cameraOutcome,'skipped');assert.equal(await run('JSON.parse(localStorage.getItem("calculus-clinic-camera-v1")).enabled'),false);
 await load();assert.equal(await choice(),'BC');assert.equal(await run('qaMediaCalls'),0);
 await click('[data-view="settings"]');await click('[data-action="review-setup"]');assert.equal(await run('!!document.querySelector(".onboarding-tutorial")'),true);await click('[data-action="onboarding-camera"]');
 await run('navigator.mediaDevices.getUserMedia=()=>new Promise(r=>window.qaResolve=r)');await click('#onboarding-camera-enable');await waitFor('!!window.qaResolve');
 await click('[data-action="onboarding-back"]');assert.equal(await run('!!document.querySelector(".onboarding-tutorial")'),true);
 await run('window.qaLate=await qaNativeMedia({video:true,audio:false});qaResolve(qaLate);await new Promise(r=>setTimeout(r,50))');assert.equal(await run('qaLate.getTracks().every(t=>t.readyState==="ended")'),true);
 await click('[data-action="onboarding-camera"]');await run('navigator.mediaDevices.getUserMedia=async options=>{qaMediaCalls++;const s=await qaNativeMedia(options);qaStreams.push(s);return s;};qaMode="face"');await click('#onboarding-camera-enable');
 await waitFor('!document.querySelector("#onboarding-finish").disabled');await click('#onboarding-finish');assert.equal((await setup()).cameraOutcome,'calibrated');
 console.log('PASS denial and missing-device recovery, 320px layout, opt-out persistence, setup replay, cancelled permission request, and successful retry');

 // Existing users keep their course and answers while receiving the new tutorial once.
 await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture)}}));localStorage.removeItem('calculus-clinic-onboarding-v1')`);await load();
 assert.equal(await run('!!document.querySelector(".onboarding-tutorial")'),true);assert.deepEqual(await stored(),fixture);
 await click('[data-action="onboarding-back"]');await click('[data-course="ALG1"]');assert.deepEqual(await stored(),fixture);await click('[data-action="onboarding-camera"]');await click('[data-action="onboarding-skip-camera"]');
 await change('#course','ALG2');assert.equal(await run('!!document.querySelector(".explore-home")'),true);assert.deepEqual(await stored(),fixture);
 const {identifier}=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const get=Storage.prototype.getItem,set=Storage.prototype.setItem;Storage.prototype.getItem=function(key){if(key==='calculus-clinic-course-v1')throw new Error('Storage blocked');return get.call(this,key)};Storage.prototype.setItem=function(key,value){if(['calculus-clinic-course-v1','calculus-clinic-onboarding-v1'].includes(key))throw new Error('Storage blocked');return set.call(this,key,value)};`});
 await load();await click('[data-course="ALG2"]');assert.match(await run('document.querySelector(".onboarding-warning").textContent'),/could not save/);await click('[data-action="onboarding-camera"]');await click('[data-action="onboarding-skip-camera"]');
 assert.equal(await run('document.querySelector("#course").value'),'ALG2');assert.match(await run('document.querySelector("#toast").textContent'),/could not save/);assert.deepEqual(await stored(),fixture);
 await send('Page.removeScriptToEvaluateOnNewDocument',{identifier});assert.deepEqual(errors,[]);
 console.log('PASS all course choices, existing-user migration, course switching, preserved history, blocked preference storage, and no runtime exceptions');
}finally{ws.close();}
