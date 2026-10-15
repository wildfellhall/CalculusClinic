// Run with an isolated Chrome profile and fake media devices only.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {enterCourse} from './browser-course-setup.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<150;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-1800)'));};
const click=selector=>run(`document.querySelector(${JSON.stringify(selector)}).click()`);
const input=(selector,value,event='input')=>run(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));})()`);
const size=width=>send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
const snap=async name=>{await run('document.fonts.ready');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const attempts=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const start=async(id='1.11')=>{await click('[data-view="practice"]');await input('#practice-concept',id,'change');await click('[data-action="start-picked"]');};
try{
 await mkdir('test-results',{recursive:true});await send('Runtime.enable');await send('Page.enable');await size(1366);
 await send('Storage.clearDataForOrigin',{origin:base,storageTypes:'local_storage'});
 await send('Page.navigate',{url:base});await enterCourse(run,waitFor);await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 await start();assert.equal(await run('document.querySelector("#practice-tools-root").hidden'),true);
 await click('.answer-options input');const choice=await run('document.querySelector(".answer-options input:checked").value');
 const before=Number(await run('document.querySelector("#question-timer").dataset.durationMs'));
 await click('#open-calculator');assert.equal(await run('document.activeElement.id'),'calculator-expression');
 assert.equal(await run('document.querySelector("#open-calculator").getAttribute("aria-expanded")'),'true');
 await input('#calculator-expression','(3 + 5) / 2');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter'});
 assert.equal(await run('document.querySelector("#calculator-result").textContent'),'4');assert.deepEqual(await attempts(),[],'Enter in the calculator must not submit the question');
 assert.equal(await run('document.querySelector(".answer-options input:checked").value'),choice);
 await input('#calculator-expression','sin(30)');await input('#calculator-angle','deg','change');await click('.calculator-equals');assert.equal(await run('document.querySelector("#calculator-result").textContent'),'0.5');
 await snap('practice-calculator-desktop');
 await click('[data-tool-action="result-to-notes"]');assert.match(await run('document.querySelector("#practice-notepad").value'),/sin\(30\) = 0.5 \(degrees\)/);
 const note='Factor the numerator first.\nx² − 9 = (x − 3)(x + 3)\nThen cancel the common factor.';
 await input('#practice-notepad',note);await snap('practice-notepad-desktop');
 await click('#notepad-clear');assert.equal(await run('document.querySelector("#practice-notepad").value'),'');await click('#notepad-clear');assert.equal(await run('document.querySelector("#practice-notepad").value'),note);
 await run('document.querySelector("#practice-notepad").focus()');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});
 assert.equal(await run('document.querySelector("#practice-tools-root").hidden'),true);assert.equal(await run('document.activeElement.id'),'open-notepad');
 await click('#open-notepad');await new Promise(r=>setTimeout(r,350));assert.ok(Number(await run('document.querySelector("#question-timer").dataset.durationMs'))>before,'Using tools counts as active question time');
 await click('[data-action="submit"]');assert.equal((await attempts()).length,1);assert.equal(await run('document.querySelector("#practice-notepad").value'),note);
 await click('[data-action="next"]');assert.equal(await run('document.querySelector("#practice-notepad").value'),note);assert.equal(await run('document.querySelector("#check-answer").disabled'),true);
 await click('[data-view="graph"]');await click('[data-view="practice"]');assert.equal(await run('document.querySelector("#practice-notepad").value'),note);
 // Both tools remain compact on mobile, with the problem scrollable above them.
 await size(390);await click('#open-notepad');await click('#open-notepad');await snap('practice-notepad-mobile');
 assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.equal(await run('getComputedStyle(document.querySelector("#practice-tools-root")).position'),'fixed');
 assert.equal(await run('document.querySelector("#practice-tools-root").getBoundingClientRect().height<=innerHeight*.51'),true);
 assert.equal(await run('document.querySelector("#question-title").getBoundingClientRect().bottom<document.querySelector("#practice-tools-root").getBoundingClientRect().top'),true,'Opening the mobile notepad keeps the full question in view');
 await click('#open-calculator');await input('#calculator-expression','1 / 0');await click('.calculator-equals');assert.match(await run('document.querySelector("#calculator-result").textContent'),/zero/);
 await input('#calculator-expression','sqrt(81) + 2^3');await click('.calculator-equals');assert.equal(await run('document.querySelector("#calculator-result").textContent'),'17');
 await snap('practice-calculator-mobile');assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 await click('[data-tool-action="clear-calculator"]');await click('[data-value="7"]');await click('[data-value="+"]');await click('[data-value="8"]');await click('.calculator-equals');assert.equal(await run('document.querySelector("#calculator-result").textContent'),'15');
 await run('document.querySelector("#calculator-expression").setSelectionRange(0,1)');await click('[data-value="9"]');assert.equal(await run('document.querySelector("#calculator-expression").value'),'9+8');
 await click('[data-tool-action="backspace"]');assert.equal(await run('document.querySelector("#calculator-expression").value'),'+8');
 await size(320);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 await click('[data-tool-action="close"]');await size(1366);
 // Reload restores notes, and different concepts have independent scratch work.
 await send('Page.reload');await waitFor('!!document.querySelector(".explore-home")');await start('1.10');await click('#open-notepad');assert.equal(await run('document.querySelector("#practice-notepad").value'),'');await input('#practice-notepad','Second concept');
 await click('[data-action="select"]');await start();assert.equal(await run('document.querySelector("#practice-notepad").value'),note);
 // Notes are inert text, even when pasted content resembles markup.
 await input('#practice-notepad','</textarea><img src=x onerror="window.qaUnsafe=true">');await click('#open-calculator');await click('#open-notepad');assert.equal(await run('window.qaUnsafe===true'),false);assert.equal(await run('document.querySelectorAll("#practice-tools-root img").length'),0);
 await input('#practice-notepad',note);
 // Camera and calibration remain untouched when opening tools or typing.
 await run(`window.qaStreams=[];window.qaWorkers=[];window.qaNativeMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async options=>{const s=await qaNativeMedia(options);qaStreams.push(s);return s;};window.qaModel=await import('/src/observations.mjs');window.Worker=class{constructor(){qaWorkers.push(this)}postMessage(data){if(data.type==='init'){setTimeout(()=>this.onmessage({data:{type:'ready'}}),5);return;}data.frame.close();setTimeout(()=>{if(!this.ended)this.onmessage({data:{type:'sample',token:data.token,at:data.at,values:Object.fromEntries(qaModel.METRICS.map(m=>[m.id,.2])),expressions:data.includeExpressions?{neutral:1,happy:0,sad:0,angry:0,fearful:0,disgusted:0,surprised:0}:null}})},5)}terminate(){this.ended=true}};`);
 await click('#camera-enable');await waitFor('document.querySelector("#camera-state").textContent==="Camera on"');
 const workers=await run('qaWorkers.length');await click('#open-calculator');await input('#calculator-expression','ln(e)');await click('.calculator-equals');await click('#open-notepad');await input('#practice-notepad',note+'\nln(e) = 1');
 await new Promise(r=>setTimeout(r,700));assert.equal(await run('qaWorkers.length'),workers);assert.equal(await run('document.querySelector("#camera-state").textContent'),'Camera on');assert.equal(await run('qaStreams.at(-1).getVideoTracks()[0].enabled'),true);
 await click('.answer-options input');await click('[data-action="submit"]');assert.ok((await attempts()).at(-1).facialMovement,'Answer observations still save while using tools');
 // Failed saves retain visible work and disclose that it is not persisted.
 await run(`window.qaSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='calculus-clinic-notes-v1')throw Error('Storage blocked');return qaSet.call(this,key,value)};`);
 await input('#practice-notepad','Unsaved working notes');assert.match(await run('document.querySelector("#notepad-status").textContent'),/Not saved/);await click('#open-calculator');await click('#open-notepad');assert.equal(await run('document.querySelector("#practice-notepad").value'),'Unsaved working notes');
 await run('Storage.prototype.setItem=qaSet');await input('#practice-notepad',note);
 await click('[data-view="settings"]');await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.equal(await run('localStorage.getItem("calculus-clinic-notes-v1")'),null);
 await start();await click('#open-notepad');assert.equal(await run('document.querySelector("#practice-notepad").value'),'');assert.deepEqual(await attempts(),[]);
 assert.deepEqual(errors,[]);
 console.log('PASS calculator keyboard/keypad and errors, note persistence/isolation/undo, answer and timer continuity, camera observations, mobile layouts, save failure, inert pasted text, and Settings deletion.');
}finally{ws.close();}
