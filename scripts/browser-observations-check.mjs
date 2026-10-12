// Isolated Chrome QA only. Start with a fresh profile, fake media devices,
// --use-fake-ui-for-media-stream and software WebGL enabled. Never use a real camera.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const qaURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[],requests=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<150;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-2500)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value)=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const snap=async name=>{await run('await document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const loadPage=async(method,params={})=>{const previous=await run('window.qaDocument??null');await send(method,params);await waitFor(`!!window.qaDocument&&window.qaDocument!==${JSON.stringify(previous)}&&document.readyState==='complete'&&!!document.querySelector('.explore-home')`);};
try{
  await mkdir('test-results',{recursive:true});await send('Runtime.enable');await send('Network.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,screenWidth:1280,screenHeight:1000,deviceScaleFactor:1,mobile:false});
  await send('Storage.clearDataForOrigin',{origin:qaURL,storageTypes:'local_storage'});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDocument=crypto.randomUUID();window.qaMediaCalls=0;window.qaStreams=[];window.qaNativeMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async options=>{window.qaMediaCalls++;const s=await qaNativeMedia(options);window.qaStream=s;qaStreams.push(s);return s;};`});
  await loadPage('Page.navigate',{url:qaURL+'/'});
  await waitFor('qaMediaCalls===1&&qaStreams.length===1&&qaStreams[0].getTracks().every(t=>t.readyState==="ended")');
  assert.equal(await run('qaStream.getAudioTracks().length'),0,'First entry requests video only and releases the permission stream');
  await loadPage('Page.reload');
  await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
  assert.ok(await run('(await navigator.mediaDevices.enumerateDevices()).some(d=>d.kind==="videoinput"&&d.label.startsWith("fake_device"))'),'This test requires Chrome fake media devices; never run it against a real camera.');
  await click('[data-view="settings"]');await waitFor('document.querySelector("#camera-access-state").textContent==="On during practice"');assert.equal(await run('qaMediaCalls'),0,'Remembered permission needs no request on the home or settings page');
  await click('[data-view="practice"]');await change('#practice-concept','1.11');await click('[data-action="start-picked"]');
  await waitFor('!document.querySelector("#camera-calibrate").hidden');assert.equal(await run('qaMediaCalls'),1);assert.equal(await run('document.querySelector("#optional-observations").open'),true);
  await click('.checkin-optional>summary');
  await change('#checkin-emotion','frustration');await change('#checkin-intensity','4');await change('#checkin-valence','unpleasant');
  assert.ok(await run('document.querySelector("#checkin-score").textContent.includes("−80")||document.querySelector("#checkin-score").textContent.includes("-80")'));
  await click('.checkin-optional>summary');
  // The real, local model processes the fake camera feed (a generated test pattern).
  assert.equal(await run('qaMediaCalls'),1);assert.equal(await run('qaStream.getAudioTracks().length'),0);
  await click('#camera-calibrate');await waitFor('document.querySelector("#camera-status").textContent.includes("No usable face")');
  assert.equal(await run('document.querySelector("#timer-status").textContent'),'Paused');
  await click('#camera-stop');assert.equal(await run('qaStream.getTracks().every(t=>t.readyState==="ended")'),true);
  // Use explicit coefficient fixtures for deterministic calibration/scoring tests.
  // This is a fake worker in the isolated test page; the production code has no QA mode.
  await run(`window.qaModel=await import('/src/observations.mjs');window.qaMode='face';window.qaValue=.2;window.qaDelay=0;window.qaExpressionKey='fearful';window.qaExpressionConfidence=.9;window.qaWorkers=[];window.qaRealWorker=Worker;window.Worker=class {
    constructor(){this.ended=false;qaWorkers.push(this)}
    postMessage(data){if(data.type==='init'){setTimeout(()=>this.onmessage?.({data:{type:'ready'}}),10);return;}data.frame.close();const values=qaMode==='face'?Object.fromEntries(qaModel.METRICS.map(m=>[m.id,qaValue])):null;const expressions=Object.fromEntries(['neutral','happy','sad','angry','fearful','disgusted','surprised'].map(k=>[k,k===qaExpressionKey?qaExpressionConfidence:(1-qaExpressionConfidence)/6]));const reason=qaMode==='multiple'?'multiple-faces':'no-face';setTimeout(()=>{if(!this.ended)this.onmessage?.({data:{type:'sample',token:data.token,at:data.at,values,expressions,reason}})},qaDelay);}
    terminate(){this.ended=true}
  };`);
  await click('#camera-enable');await waitFor('!document.querySelector("#camera-calibrate").hidden');await click('#camera-calibrate');
  await waitFor('document.querySelector("#camera-state").textContent==="Camera on"');
  await run('window.qaValue=.6');await new Promise(r=>setTimeout(r,1200));
  await run('document.querySelector("#optional-observations").scrollIntoView({block:"start"})');await snap('observations-desktop');
  await click('.answer-options input');await click('[data-action="submit"]');
  const first=(await stored())[0];assert.equal(first.selfReport.sentimentScore,-80);assert.equal(first.selfReport.source,'self-report');assert.ok(first.facialMovement.changeScore>0);assert.ok(first.facialMovement.observedMs<=first.durationMs);
  assert.equal(first.facialMovement.metrics.jawOpen.meanDelta,.4);assert.equal(first.facialExpression.source,'camera-expression');assert.ok(first.facialExpression.probabilities.fearful>.89);assert.ok(first.facialExpression.adjustment>.14&&first.facialExpression.adjustment<=.2);assert.ok(first.facialExpression.observedMs<=first.durationMs);assert.equal(await run('qaStream.getTracks()[0].enabled'),false);
  const frozen=JSON.stringify(await stored());await new Promise(r=>setTimeout(r,500));assert.equal(JSON.stringify(await stored()),frozen);
  await click('[data-action="next"]');assert.equal(await run('document.querySelector("#checkin-emotion").value'),'');
  await run('window.qaMode="multiple"');await waitFor('document.querySelector("#camera-status").textContent.includes("More than one face")');
  await click('.answer-options input');await click('[data-action="submit"]');assert.equal((await stored())[1].facialMovement,undefined);assert.equal((await stored())[1].facialExpression,undefined);assert.equal((await stored())[1].selfReport,undefined);
  await click('[data-action="next"]');await run('window.qaMode="face";window.qaValue=.2');await click('#camera-calibrate');await waitFor('document.querySelector("#camera-state").textContent==="Camera on"');
  await run('window.qaValue=.7');await new Promise(r=>setTimeout(r,650));await click('#camera-calibrate');
  await click('.answer-options input');await click('[data-action="submit"]');assert.equal((await stored())[2].facialMovement,undefined,'Recalibration discards the old unsaved measurements');
  await click('[data-view="graph"]');assert.equal(await run('qaStream.getTracks().every(t=>t.readyState==="ended")'),true);assert.equal(await run('qaWorkers.every(w=>w.ended)'),true);
  await change('#graph-concept','1.11');await click('.node-observations>summary');assert.ok(await run('document.querySelector(".node-observations").textContent.includes("-80")'));
  await run('document.querySelector(".node-observations").scrollIntoView({block:"start"})');await snap('observations-node');
  // Revocation in Settings persists across reloads without changing stored scores.
  await click('[data-view="settings"]');await run('document.querySelector("#camera-revoke").focus()');await click('#camera-revoke');
  assert.equal(await run('document.querySelector("#camera-access-state").textContent'),'Off');
  assert.equal(await run('document.activeElement.id'),'camera-settings-enable');
  await snap('camera-settings-desktop');
  await loadPage('Page.reload');assert.equal((await stored())[0].selfReport.sentimentScore,-80);
  await click('[data-view="practice"]');await click('[data-action="start-picked"]');await click('#optional-observations>summary');
  assert.equal(await run('document.querySelector("#camera-state").textContent'),'Camera off');assert.equal(await run('qaMediaCalls'),0);
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,screenWidth:390,screenHeight:844,deviceScaleFactor:1,mobile:true});await waitFor('innerWidth===390');
  await run('document.querySelector("#optional-observations").scrollIntoView({block:"start"})');await snap('observations-mobile');assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
  // Denial does not block practicing, and late permission cannot revive a stopped camera.
  await run(`navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError')}`);
  await click('#camera-enable');await waitFor('document.querySelector("#camera-status").textContent.includes("not granted")');
  await run('navigator.mediaDevices.getUserMedia=()=>new Promise(r=>window.qaResolve=r)');await click('#camera-enable');
  await click('[data-view="settings"]');await waitFor('document.querySelector("#camera-access-state").textContent==="Waiting for permission"');await click('#camera-revoke');
  await run('window.qaLate=await qaNativeMedia({video:true,audio:false});qaResolve(qaLate);await new Promise(r=>setTimeout(r,50))');assert.equal(await run('qaLate.getTracks().every(t=>t.readyState==="ended")'),true);assert.equal(await run('document.querySelector("#camera-access-state").textContent'),'Off');
  await run('document.querySelector(".camera-settings").scrollIntoView({block:"start"})');await snap('camera-settings-mobile');assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
  // Capture exports without modifying production download behavior.
  await click('[data-view="settings"]');await run('window.qaDownloads=[];URL.createObjectURL=b=>{qaDownloads.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){}');
  await click('[data-action="export-progress"]');await click('[data-action="export-attempts"]');await click('[data-action="backup"]');
  const exports=await run('await Promise.all(qaDownloads.map(b=>b.text()))');assert.ok(exports[0].includes('selfReportedSentiment'));assert.ok(exports[1].includes('jawOpenMeanDelta'));assert.ok(exports[1].includes('camera_fearful'));assert.ok(exports[0].includes('cameraAdjustedAccuracy'));const backup=JSON.parse(exports[2]);assert.equal(backup.attempts[0].selfReport.sentimentScore,-80);
  await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.deepEqual(await stored(),[]);
  assert.equal(await run('JSON.parse(localStorage.getItem("calculus-clinic-camera-v1")).enabled'),false);
  await run(`const data=${JSON.stringify(exports[2])};const file=new File([data],'backup.json',{type:'application/json'});const dt=new DataTransfer();dt.items.add(file);const input=document.querySelector('#import-file');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));`);
  await waitFor('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts.length===3');assert.deepEqual(await stored(),backup.attempts);
  assert.equal(await run('JSON.parse(localStorage.getItem("calculus-clinic-camera-v1")).enabled'),false,'Restoring practice must never restore camera access');
  await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.deepEqual(await stored(),[]);
  assert.deepEqual(errors,[]);assert.equal(requests.filter(u=>/^https?:/.test(u)&&!u.startsWith(qaURL+'/')).length,0);
  console.log('Browser observations passed: first-entry request, remembered automatic camera start, local real-model/no-face processing, calibration, saved scores, missing/multiple faces, feedback boundaries, Settings revocation and persistence, camera release, permission denial/race, exports, restore/delete and mobile layout.');
}finally{ws.close();}
