// Isolated browser profile; generated practice data and fake camera media only.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {enterCourse} from './browser-course-setup.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await(await fetch('http://127.0.0.1:9224/json/list')).json(),ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<180;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw Error('Condition not met: '+expression);};
const click=selector=>run(`document.querySelector(${JSON.stringify(selector)}).click()`);
const input=(selector,value,event='input')=>run(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));})()`);
const size=width=>send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
const snap=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const key='calculus-clinic-scratch-v1:1.11';
const strokes=()=>run(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))?.strokes||[]`);
const attempts=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const start=async(id='1.11')=>{await run('document.querySelector(".practice-top [data-action=select]")?.click()');await click('[data-view="practice"]');await input('#practice-concept',id,'change');await click('[data-action="start-picked"]');};
const canvas=()=>run('document.querySelector("#scratch-canvas").toDataURL()');
const draw=async(points,pointerType='mouse',release=true)=>{
 const r=await run('document.querySelector("#scratch-canvas").getBoundingClientRect().toJSON()');
 const scale=Math.min(r.width/1000,r.height/700),point=([x,y])=>({x:r.x+(r.width-scale*1000)/2+x*scale,y:r.y+(r.height-scale*700)/2+y*scale});
 await send('Input.dispatchMouseEvent',{type:'mousePressed',...point(points[0]),button:'left',clickCount:1,pointerType});
 for(const p of points.slice(1))await send('Input.dispatchMouseEvent',{type:'mouseMoved',...point(p),button:'left',buttons:1,pointerType});
 if(release)await send('Input.dispatchMouseEvent',{type:'mouseReleased',...point(points.at(-1)),button:'left',clickCount:1,pointerType});
 return point(points.at(-1));
};
try{
 await mkdir('test-results',{recursive:true});await send('Runtime.enable');await send('Page.enable');await size(1440);await send('Storage.clearDataForOrigin',{origin:base,storageTypes:'local_storage'});await send('Page.navigate',{url:base});await enterCourse(run,waitFor);await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 await run('localStorage.setItem("calculus-clinic-notes-v1",JSON.stringify({version:1,notes:{"1.11":"Factor the numerator first."}}))');await send('Page.reload');await waitFor('!!document.querySelector(".explore-home")');await start();await click('.answer-options input');const choice=await run('document.querySelector(".answer-options input:checked").value');
 await click('#open-notepad');assert.equal(await run('document.activeElement.id'),'scratch-canvas');assert.equal(await run('document.querySelector("#practice-notepad").value'),'Factor the numerator first.');assert.equal(await run('document.querySelector(".scratch-typed").open'),false);
 const blank=await canvas(),before=Number(await run('document.querySelector("#question-timer").dataset.durationMs'));
 await draw([[120,180],[300,180],[500,180],[740,180]]);assert.equal((await strokes()).length,1);const ink=await canvas();assert.notEqual(ink,blank);
 await click('[data-scratch="eraser"]');await draw([[300,120],[300,250]]);assert.equal((await strokes())[1].tool,'eraser');const erased=await canvas();assert.notEqual(erased,ink);
 await click('[data-scratch="undo"]');assert.equal(await canvas(),ink);await click('[data-scratch="redo"]');assert.equal(await canvas(),erased);
 await click('[data-scratch="clear"]');assert.equal((await strokes()).length,0);assert.equal(await canvas(),blank);await click('[data-scratch="undo"]');assert.equal(await canvas(),erased);
 await click('[data-color="#365fa0"]');await draw([[120,340],[210,450],[300,340]],'pen');assert.equal((await strokes()).at(-1).color,'#365fa0');assert.equal((await strokes()).at(-1).tool,'pen');
 await waitFor(`Number(document.querySelector("#question-timer").dataset.durationMs)>${before}`);assert.equal(await run('document.querySelector(".answer-options input:checked").value'),choice);
 await snap('practice-scratch-desktop');await click('[data-scratch="expand"]');assert.equal(await run('document.querySelector("#practice-tools-root").classList.contains("scratch-expanded")'),true);await snap('practice-scratch-expanded');await click('[data-scratch="expand"]');
 const saved=await strokes();await click('[data-tool-action="close"]');await click('#open-notepad');assert.deepEqual(await strokes(),saved);
 await click('[data-action="submit"]');assert.deepEqual((await attempts())[0].scratchSnapshot,{version:1,strokes:saved});
 await draw([[100,500],[500,600]]);assert.deepEqual((await attempts())[0].scratchSnapshot.strokes,saved,'Feedback edits cannot rewrite the submitted snapshot');await click('[data-scratch="undo"]');
 await click('[data-action="next"]');await click('[data-scratch="clear"]');await click('[data-tool-action="close"]');await click('.answer-options input');await click('[data-action="submit"]');assert.deepEqual((await attempts())[1].scratchSnapshot,{version:1,strokes:[]},'A blank pad is captured even when closed');
 await click('#open-notepad');await click('[data-scratch="undo"]');await click('[data-action="next"]');await click('.answer-options input');
 const end=await draw([[100,520],[300,620]],'mouse',false);assert.deepEqual(await strokes(),saved);await click('[data-action="submit"]');await send('Input.dispatchMouseEvent',{type:'mouseReleased',...end,button:'left',clickCount:1});
 const submitted=await attempts();assert.equal(submitted[2].scratchSnapshot.strokes.length,saved.length+1,'Submission finishes an in-progress stroke before taking its snapshot');assert.deepEqual(submitted[0].scratchSnapshot.strokes,saved);await click('[data-scratch="undo"]');await click('[data-action="next"]');
 assert.deepEqual(await strokes(),saved);await click('[data-view="graph"]');await click('[data-view="practice"]');assert.deepEqual(await strokes(),saved);
 // Reload and a different concept preserve each concept's work independently.
 await send('Page.reload');await waitFor('!!document.querySelector("[data-view=practice]")');assert.deepEqual(await attempts(),submitted);await start('1.12');await click('#open-notepad');assert.equal(await run('document.querySelector("[data-scratch=clear]").disabled'),true);await draw([[200,200],[500,450]]);await start();assert.equal(await run('document.querySelector("[data-scratch=clear]").disabled'),false);assert.deepEqual(await strokes(),saved);
 // Touch drawing must stay inside the paper instead of scrolling the page.
 await size(390);await click('#open-notepad');await click('#open-notepad');await new Promise(r=>setTimeout(r,200));assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 const r=await run('document.querySelector("#scratch-canvas").getBoundingClientRect().toJSON()'),scroll=await run('scrollY');
 await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+50,y:r.y+70}]});await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x+140,y:r.y+110}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await run('scrollY'),scroll);assert.equal((await strokes()).length,saved.length+1);await snap('practice-scratch-mobile');await size(320);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 await click('[data-scratch="expand"]');assert.equal(await run('(()=>{const r=document.querySelector("#practice-tools-root").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight})()'),true);await click('[data-scratch="expand"]');await size(1440);
 // Save failures are visible and do not discard the current drawing.
 await run('window.qaSave=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key.startsWith("calculus-clinic-scratch-"))throw Error("QA quota");return qaSave.call(this,key,value)}');await draw([[350,400],[600,500]]);assert.match(await run('document.querySelector("#scratch-status").textContent'),/could not be saved/);assert.equal(await run('document.querySelector("[data-scratch=undo]").disabled'),false);await run('Storage.prototype.setItem=qaSave');await click('[data-scratch="undo"]');
 // Downloads produce a PNG; notes still accept text without executing it.
 await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:process.cwd()+'/test-results',eventsEnabled:true});await click('[data-scratch="download"]');
 await click('.scratch-typed summary');await input('#practice-notepad','<img src=x onerror="window.qaInjected=true">');assert.equal(await run('!!window.qaInjected'),false);await click('#notepad-clear');assert.equal(await run('document.querySelector("#practice-notepad").value'),'');await click('#notepad-clear');assert.match(await run('document.querySelector("#practice-notepad").value'),/onerror/);
 await run(`localStorage.removeItem(${JSON.stringify(key)});window.dispatchEvent(new StorageEvent('storage',{key:${JSON.stringify(key)},newValue:null}))`);assert.equal(await run('document.querySelector("[data-scratch=clear]").disabled'),true,'Deleting drawings in another tab clears the visible page and undo history');
 await click('[data-view="settings"]');await run('window.qaBlobs=[];URL.createObjectURL=b=>{qaBlobs.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){}');await click('[data-action="backup"]');
 const backup=await run('await qaBlobs[0].text()');assert.deepEqual(JSON.parse(backup).attempts,submitted);
 await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.equal(await run('Object.keys(localStorage).some(key=>key.startsWith("calculus-clinic-scratch-")||key==="calculus-clinic-notes-v1"||key==="calculus-clinic-progress-v1")'),false);
 await run(`(()=>{const dt=new DataTransfer();dt.items.add(new File([${JSON.stringify(backup)}],'snapshot-backup.json',{type:'application/json'}));const input=document.querySelector('#import-file');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);await waitFor('document.querySelector("#toast").textContent.includes("Imported")');assert.deepEqual(await attempts(),submitted);
 await send('Page.reload');await waitFor('!!document.querySelector("[data-view=settings]")');assert.deepEqual(await attempts(),submitted);await click('[data-view="settings"]');await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.deepEqual(await attempts(),[]);
 assert.deepEqual(errors,[]);console.log('PASS scratch drawing/erasing, per-answer snapshots including blank and in-progress drawings, immutable submission history, reload and backup restore, undo/redo/clear, stylus and touch, resize/expand, image export, legacy notes, timer/answer continuity, quota recovery, and deletion.');
}catch(error){await snap('practice-tools-failure');throw error;}finally{ws.close();}
