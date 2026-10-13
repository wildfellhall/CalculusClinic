// Run in an isolated Chrome profile on port 9224 with fake media devices only.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {questions} from '../data/catalog.mjs';
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
const load=async(method='Page.reload',params={})=>{const before=await run('window.qaDocument??null');await send(method,params);await waitFor(`!!window.qaDocument&&window.qaDocument!==${JSON.stringify(before)}&&document.readyState==='complete'&&!!document.querySelector('.course-onboarding,.explore-home')`);};
const snap=async name=>{await run('await document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const choice=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-course-v1"))?.course');
const fixture=['1.2','9.1'].map(id=>{const q=questions.find(q=>q.conceptId===id);return {id:'onboarding-'+q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-12T12:00:00.000Z',sessionId:'onboarding-qa',durationMs:50000};});
try{
  await mkdir('test-results',{recursive:true});await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,screenWidth:1280,screenHeight:1000,deviceScaleFactor:1,mobile:false});
  await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDocument=crypto.randomUUID();window.qaMediaCalls=0;window.qaStreams=[];const nativeMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async options=>{qaMediaCalls++;const stream=await nativeMedia(options);qaStreams.push(stream);return stream;};`});
  await load('Page.navigate',{url:appURL+'/'});await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
  assert.equal(await run('document.querySelectorAll("[data-action=choose-course]").length'),4);
  assert.equal(await run('qaMediaCalls'),0,'Course choice must appear before the camera request');
  assert.equal(await choice(),undefined);await snap('onboarding-desktop');
  await run('document.querySelector(\'[data-course="AB"]\').focus()');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter'});
  await waitFor('!!document.querySelector(".explore-home")&&qaMediaCalls===1&&qaStreams.length===1');
  assert.equal(await choice(),'AB');assert.equal(await run('document.querySelector("#course").value'),'AB');
  assert.equal(await run('qaStreams[0].getTracks().every(t=>t.readyState==="ended")'),true,'Permission grant must release the entry stream');
  await click('[data-view="graph"]');await change('#graph-scope','all');
  assert.equal(await run('document.querySelectorAll(".graph-node").length'),97);assert.equal(await run('!!document.querySelector(\'.graph-node[data-concept="9.1"]\')'),false);
  await click('[data-view="practice"]');assert.equal(await run('[...document.querySelector("#practice-concept").options].some(o=>o.value==="9.1")'),false);
  await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture)}}))`);
  await load();assert.equal(await run('document.querySelector("#course").value'),'AB');assert.equal(await run('qaMediaCalls'),0);assert.deepEqual(await stored(),fixture);
  await change('#course','BC');assert.equal(await choice(),'BC');assert.deepEqual(await stored(),fixture);
  await click('[data-view="graph"]');await change('#graph-scope','all');assert.equal(await run('document.querySelectorAll(".graph-node").length'),127);assert.equal(await run('!!document.querySelector(\'.graph-node[data-concept="9.1"]\')'),true);
  await load();assert.equal(await run('document.querySelector("#course").value'),'BC');assert.deepEqual(await stored(),fixture);
  // First-visit BC choice on mobile still works if the camera request is denied.
  await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,screenWidth:390,screenHeight:844,deviceScaleFactor:1,mobile:true});await load();
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await snap('onboarding-mobile');
  await run('navigator.mediaDevices.getUserMedia=async()=>{qaMediaCalls++;throw new DOMException("Denied","NotAllowedError")}');
  await click('[data-course="BC"]');await waitFor('JSON.parse(localStorage.getItem("calculus-clinic-camera-v1"))?.enabled===false');
  assert.equal(await run('document.querySelector("#course").value'),'BC');assert.equal(await choice(),'BC');
  await load();assert.equal(await run('document.querySelector("#course").value'),'BC');assert.equal(await run('qaMediaCalls'),0);
  // Existing records survive onboarding introduced for a browser with no valid course choice.
  await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture)}}));localStorage.setItem('calculus-clinic-course-v1','{"version":1,"course":["AB"]}')`);
  await load();assert.equal(await run('!!document.querySelector(".course-onboarding")'),true);assert.deepEqual(await stored(),fixture);await click('[data-course="AB"]');assert.deepEqual(await stored(),fixture);
  // With unavailable preference storage, a choice still enters the app for this visit.
  const {identifier}=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const get=Storage.prototype.getItem,set=Storage.prototype.setItem;Storage.prototype.getItem=function(key){if(key==='calculus-clinic-course-v1')throw new Error('Storage blocked');return get.call(this,key)};Storage.prototype.setItem=function(key,value){if(key==='calculus-clinic-course-v1')throw new Error('Storage blocked');return set.call(this,key,value)};`});
  await load();await click('[data-course="BC"]');assert.equal(await run('document.querySelector("#course").value'),'BC');assert.match(await run('document.querySelector("#toast").textContent'),/could not save/);assert.deepEqual(await stored(),fixture);
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier});
  assert.deepEqual(errors,[]);
  console.log('PASS first-visit AB/BC onboarding, keyboard activation, desktop/mobile layouts, camera request after course selection, permission denial, course persistence and switching, AB/BC graph and practice filtering, preserved history, invalid preferences and storage failure.');
}finally{ws.close();}
