// Isolated Chrome QA with fake video only. NumWorks loads from its official embed.
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
const size=width=>send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
try{
 await mkdir('test-results',{recursive:true});await send('Runtime.enable');await send('Page.enable');await size(1440);await send('Storage.clearDataForOrigin',{origin:base,storageTypes:'local_storage'});await send('Page.navigate',{url:base});await enterCourse(run,waitFor);await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 await click('[data-view="practice"]');await click('[data-action="start-picked"]');await click('.answer-options input');
 assert.equal(await run('!!document.querySelector("#scientific-frame")'),false);await click('#open-calculator');await waitFor('!!document.querySelector("#scientific-frame")&&document.querySelector("#scientific-panel .embedded-loading").hidden');
 let target;
 for(let i=0;i<100;i++){target=(await send('Target.getTargets')).targetInfos.find(t=>t.type==='iframe'&&t.url.startsWith('https://www.numworks.com/simulator/embed/'));if(target)break;await new Promise(r=>setTimeout(r,100));}
 assert.ok(target);const {sessionId}=await send('Target.attachToTarget',{targetId:target.targetId,flatten:true});
 await waitFor('!!document.querySelector(".calculator canvas")&&document.querySelectorAll("[data-key]").length>40',sessionId);await waitFor('Array.from(document.querySelector(".calculator canvas").getContext("2d").getImageData(0,0,320,240).data).some((v,i)=>i%4===3&&v>0)',sessionId);
 await run('window.qaVisit="original-calculator";document.querySelector(".calculator canvas").focus()',sessionId);
 const screen=()=>run('document.querySelector(".calculator canvas").toDataURL()',sessionId);
 const key=async name=>{for(const type of ['pointerdown','pointerup']){await run(`document.querySelector('[data-key="${name}"]').dispatchEvent(new PointerEvent('${type}',{bubbles:true,pointerId:1,pointerType:'mouse',isPrimary:true,button:0}))`,sessionId);await new Promise(r=>setTimeout(r,70));}};
 const home=await screen();await key('ok');assert.notEqual(await screen(),home,'OK opens the selected calculation app');
 const empty=await screen();for(const name of ['sqrt','eight','one','right','plus','two','power','three','exe'])await key(name);assert.notEqual(await screen(),empty,'Scientific keypad enters and evaluates the expression');
 await snap('practice-numworks-desktop');
 assert.equal(await run('(()=>{const f=document.querySelector("#scientific-panel").getBoundingClientRect(),t=document.querySelector(".practice-tool-launcher").getBoundingClientRect();return f.top>=t.bottom})()'),true,'Calculator must not cover the tool buttons');
 assert.equal(await run('document.querySelector("#check-answer").disabled'),false);assert.equal(await run('document.querySelector(".question-meta").textContent.includes("QUESTION 1")'),true);
 await run('document.querySelector(".calculator canvas").focus()',sessionId);
 for(const [key,code,keyCode] of [['1','Digit1',49],['/','Slash',191],['3','Digit3',51],['Enter','Enter',13]]){await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:keyCode,text:key==='Enter'?'\r':key});await new Promise(r=>setTimeout(r,70));await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:keyCode});await new Promise(r=>setTimeout(r,100));}
 const elapsed=Number(await run('document.querySelector("#question-timer").dataset.durationMs'));await waitFor(`Number(document.querySelector("#question-timer").dataset.durationMs)>${elapsed}`);assert.equal(await run('document.querySelector("#timer-status").textContent'),'Active time');
 await click('#scientific-panel [data-tool-action="expand-embed"]');await snap('practice-numworks-expanded');await click('#scientific-panel [data-tool-action="expand-embed"]');
 await click('#open-notepad');assert.equal(await run('document.querySelector("#scientific-panel").hidden'),true);await click('#open-calculator');assert.equal(await run('window.qaVisit',sessionId),'original-calculator');
 await click('[data-action="submit"]');await click('[data-action="next"]');assert.equal(await run('window.qaVisit',sessionId),'original-calculator');await click('[data-view="graph"]');assert.equal(await run('document.querySelector("#scientific-panel").hidden'),true);await click('[data-view="practice"]');assert.equal(await run('window.qaVisit',sessionId),'original-calculator');
 await size(390);await click('#open-calculator');await click('#open-calculator');await new Promise(r=>setTimeout(r,300));assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await snap('practice-numworks-mobile');await size(320);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await click('#scientific-panel [data-tool-action="expand-embed"]');assert.equal(await run('(()=>{const r=document.querySelector("#scientific-panel").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight})()'),true);
 await click('#scientific-panel [data-tool-action="close"]');await click('[data-view="settings"]');await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.equal(await run('!!document.querySelector("#scientific-frame")'),false);
 assert.deepEqual(errors,[]);console.log('PASS real NumWorks emulator load, scientific keypad/keyboard interaction, persistent session across tools/questions/navigation, expand/mobile layouts, timer continuity, and deletion. Inspect screenshots for numeric results.');
}catch(error){await snap('numworks-failure');throw error;}finally{ws.close();}
