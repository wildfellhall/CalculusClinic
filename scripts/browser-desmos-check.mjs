// Isolated Chrome QA with fake video only. Desmos itself loads from its real site.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {enterCourse} from './browser-course-setup.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await(await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[],requests=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}if(!m.sessionId&&m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params,sessionId}));});
const run=async(expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true},sessionId);if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async(expression,sessionId)=>{for(let i=0;i<200;i++){if(await run(expression,sessionId))return;await new Promise(r=>setTimeout(r,100));}throw Error('Condition not met: '+expression);};
const click=selector=>run(`document.querySelector(${JSON.stringify(selector)}).click()`);
const snap=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const equationLabel='document.querySelector("textarea:not([aria-hidden])").parentElement.parentElement.querySelector(".dcg-mq-root-block").textContent';
const size=width=>send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
try{
 await mkdir('test-results',{recursive:true});await send('Runtime.enable');await send('Network.enable');await send('Page.enable');await size(1440);
 await send('Storage.clearDataForOrigin',{origin:base,storageTypes:'local_storage'});await send('Page.navigate',{url:base});await enterCourse(run,waitFor);await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 await click('[data-view="practice"]');await click('[data-action="start-picked"]');
 assert.equal(await run('!!document.querySelector("#desmos-frame")'),false);assert.equal(requests.some(url=>url.includes('desmos.com')),false,'Desmos must not load until requested');
 await click('.answer-options input');const choice=await run('document.querySelector(".answer-options input:checked").value');await click('#open-desmos');
 await waitFor('!!document.querySelector("#desmos-frame")&&document.querySelector(".desmos-loading").hidden');
 let target;
 for(let i=0;i<100;i++){target=(await send('Target.getTargets')).targetInfos.find(t=>t.type==='iframe'&&t.url.startsWith('https://www.desmos.com/calculator'));if(target)break;await new Promise(r=>setTimeout(r,100));}
 assert.ok(target,'The real Desmos frame loads');
 const {sessionId}=await send('Target.attachToTarget',{targetId:target.targetId,flatten:true});
 await waitFor('!!document.querySelector("textarea:not([aria-hidden])")',sessionId);
 await run('window.qaVisit="original-desmos"',sessionId);
 await run('document.querySelector("textarea:not([aria-hidden])").focus()',sessionId);
 // MathQuill consumes keyboard events; insertText alone only changes its hidden
 // textarea. Route key events through the top-level page to the focused frame.
 for(const [key,code,keyCode,modifiers] of [['y','KeyY',89,0],['=','Equal',187,0],['x','KeyX',88,0],['^','Digit6',54,8],['2','Digit2',50,0]]){
  await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:keyCode,modifiers,text:key});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:keyCode,modifiers});
  await new Promise(r=>setTimeout(r,50));
 }
 await waitFor('document.querySelector("textarea:not([aria-hidden])").parentElement.parentElement.querySelector(".dcg-mq-root-block").textContent.replaceAll("\\u200b","").includes("y=x2")',sessionId);
 assert.equal(await run('document.querySelector(".answer-options input:checked").value'),choice);
 await waitFor('document.querySelector("#timer-status").textContent==="Active time"');
 assert.equal(await run('document.hasFocus()'),true);assert.equal(await run('document.activeElement.id'),'desmos-frame');
 const elapsed=Number(await run('document.querySelector("#question-timer").dataset.durationMs'));
 await waitFor(`Number(document.querySelector("#question-timer").dataset.durationMs)>${elapsed}`);
 await snap('practice-desmos-desktop');
 const visible=await run('(()=>{const f=document.querySelector("#desmos-panel").getBoundingClientRect(),q=document.querySelector(".question-card").getBoundingClientRect();return f.left>=q.right&&f.right<=innerWidth&&f.bottom<=innerHeight})()');assert.equal(visible,true,'Desmos sits beside the question inside the viewport');
 await click('#open-notepad');assert.equal(await run('document.querySelector("#desmos-panel").hidden'),true);await click('#open-desmos');assert.equal(await run('window.qaVisit',sessionId),'original-desmos');
 await click('#desmos-panel [data-tool-action="close"]');assert.equal(await run('document.activeElement.id'),'open-desmos');await click('#open-desmos');assert.equal(await run('window.qaVisit',sessionId),'original-desmos');
 await click('[data-action="submit"]');await click('[data-action="next"]');assert.equal(await run('window.qaVisit',sessionId),'original-desmos');
 await click('[data-view="graph"]');assert.equal(await run('document.querySelector("#desmos-panel").hidden'),true);await click('[data-view="practice"]');assert.equal(await run('window.qaVisit',sessionId),'original-desmos');
 assert.match(await run(equationLabel,sessionId),/y.*x.*2/s);
 await size(390);await click('#open-desmos');await click('#open-desmos');await new Promise(r=>setTimeout(r,400));
 assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.equal(await run('(()=>{const r=document.querySelector("#desmos-panel").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&r.height<=innerHeight*.61})()'),true);
 await snap('practice-desmos-mobile');await size(320);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await size(1440);
 // A true window blur still pauses practice; focus inside an iframe does not.
 await run('window.qaHasFocus=document.hasFocus.bind(document);document.hasFocus=()=>false;window.dispatchEvent(new Event("blur"))');await waitFor('document.querySelector("#timer-status").textContent==="Paused"');
 await run('document.hasFocus=qaHasFocus;window.dispatchEvent(new Event("focus"))');await waitFor('document.querySelector("#timer-status").textContent==="Active time"');
 // Use a fake camera worker to verify tracking continues while Desmos has focus.
 await run(`window.qaModel=await import('/src/observations.mjs');window.qaWorkers=[];window.Worker=class{constructor(){qaWorkers.push(this)}postMessage(data){if(data.type==='init'){setTimeout(()=>this.onmessage({data:{type:'ready'}}),5);return;}data.frame.close();setTimeout(()=>{if(!this.ended)this.onmessage({data:{type:'sample',token:data.token,at:data.at,values:Object.fromEntries(qaModel.METRICS.map(m=>[m.id,.2])),expressions:data.includeExpressions?{neutral:1,happy:0,sad:0,angry:0,fearful:0,disgusted:0,surprised:0}:null}})},5)}terminate(){this.ended=true}};`);
 await click('#camera-enable');await waitFor('document.querySelector("#camera-state").textContent==="Camera on"');await run('document.querySelector("textarea:not([aria-hidden])").focus()',sessionId);await new Promise(r=>setTimeout(r,800));
 assert.equal(await run('document.querySelector("#camera-state").textContent'),'Camera on');assert.equal(await run('document.querySelector("#timer-status").textContent'),'Active time');
 await click('.answer-options input');await click('[data-action="submit"]');assert.ok(await run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1")).attempts.at(-1).facialMovement'));
 await click('[data-view="settings"]');await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.equal(await run('!!document.querySelector("#desmos-frame")'),false,'Deleting data clears the in-memory graph');
 assert.deepEqual(errors,[]);
 console.log('PASS real Desmos equation entry, lazy loading, graph preservation across tools/questions/navigation, desktop/mobile layout, iframe focus timing, camera continuity, and deletion.');
}finally{ws.close();}
