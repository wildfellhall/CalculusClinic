// Isolated local QA with fabricated historical answers and denied camera access.
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import {questions as oldCalculus} from '../data/questions.mjs';
import {questions as oldAlgebra} from '../data/algebra/questions.mjs';
const appURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<150;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-1500)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value)=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const load=async(method='Page.reload',params={})=>{const before=await run('window.qaDocument??null');await send(method,params);await waitFor(`!!window.qaDocument&&window.qaDocument!==${JSON.stringify(before)}&&document.readyState==='complete'&&!!document.querySelector('.course-onboarding,.explore-home')`);};
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const fixture=[...oldAlgebra.filter(q=>q.conceptId==='MATH_028'),...oldCalculus.filter(q=>q.conceptId==='1.11')].map((q,i)=>({id:'historical-'+q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:new Date(Date.UTC(2026,9,11,12,i)).toISOString(),sessionId:'old-bank',durationMs:40000}));
const graphNode=id=>run(`(()=>{const n=document.querySelector('.graph-node[data-concept="${id}"]');return {status:n?.dataset.status,score:n?.dataset.fillScore}})()`);
try{
 await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
 await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDocument=crypto.randomUUID();navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('QA denied','NotAllowedError')};`});
 await load('Page.navigate',{url:appURL});await click('[data-course="ALG1"]');await waitFor('!!document.querySelector(".explore-home")');
 await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture)}}))`);await load();
 assert.deepEqual(await stored(),fixture);assert.equal(await run('document.body.innerText.includes("Saved progress could not be read")'),false);
 await click('[data-view="graph"]');await change('#graph-concept','MATH_028');assert.deepEqual(await graphNode('MATH_028'),{status:'unseen',score:'unscored'});
 await change('#course','BC');await change('#graph-concept','1.11');assert.deepEqual(await graphNode('1.11'),{status:'partial',score:'80'});
 await click('[data-view="settings"]');assert.match(await run('document.querySelector("#archived-attempt-note").textContent'),/12 earlier answers/);
 await run('window.qaDownloads=[];URL.createObjectURL=b=>{qaDownloads.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){}');
 await click('[data-action="backup"]');const backup=JSON.parse(await run('await qaDownloads[0].text()'));assert.deepEqual(backup.attempts,fixture);assert.equal(backup.bankVersion,'1.3.0');
 // The import path uses historical keys too; importing the same backup is idempotent.
 await run(`(()=>{const file=new File([${JSON.stringify(JSON.stringify({schemaVersion:1,bankVersion:'1.2.0',attempts:fixture}))}],'old-progress.json',{type:'application/json'});const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('#import-file');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitFor('document.querySelector("#toast").textContent.includes("Imported 0 new attempts")');assert.deepEqual(await stored(),fixture);
 await click('[data-view="practice"]');await change('#practice-concept','1.11');await click('[data-action="start-picked"]');
 assert.equal(await run('document.querySelector("input[name=answer]").value.split("-A")[0]'),'1.11-R2-Q1');
 assert.match(await run('document.querySelector(".question-title").textContent'),/for continuity/);
 const correct=await run('CALCULUS_DATA.questions.find(q=>q.id==="1.11-R2-Q1").correctOptionId');await click(`input[value="${correct}"]`);await click('#check-answer');await click('[data-action="next"]');
 assert.equal(await run('document.querySelector("input[name=answer]").value.split("-A")[0]'),'1.11-R2-Q9');
 await load();assert.equal((await stored()).length,21);
 await click('[data-view="graph"]');await change('#graph-concept','1.11');assert.deepEqual(await graphNode('1.11'),{status:'partial',score:'90'});
 await change('#course','ALG1');await click('[data-view="practice"]');await change('#practice-concept','MATH_055');await click('[data-action="start-picked"]');
 assert.match(await run('document.querySelector(".question-title").textContent'),/calculate Pearson/);
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await waitFor('innerWidth===390');await run('await document.fonts.ready');
 assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);assert.equal(await run('document.querySelectorAll(".katex-error").length'),0);
 await mkdir('test-results',{recursive:true});const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile('test-results/revised-correlation-mobile.png',Buffer.from(shot.data,'base64'));
 assert.deepEqual(errors,[]);
 console.log('PASS historical localStorage and backup import, preserved old keys, fresh-answer requirements, partial mastery, revised problem ordering, persistent new answers, and mobile application questions.');
}finally{ws.close();}
