// Local browser QA in an isolated Chrome profile on port 9224; no real camera.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const appURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),20000)});ws.send(JSON.stringify({id,method,params,sessionId}));});
const run=async(expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<100;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-1500)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value,event='change')=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));})()`);
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))');
const load=async(method='Page.reload',params={})=>{const before=await run('window.qaDocument??null');await send(method,params);await waitFor(`!!window.qaDocument&&window.qaDocument!==${JSON.stringify(before)}&&document.readyState==='complete'&&!!document.querySelector('.course-onboarding,.explore-home')`);};
const size=async width=>{await send('Emulation.setDeviceMetricsOverride',{width,height:width<500?844:1100,deviceScaleFactor:1,mobile:width<500});await run('window.scrollTo(0,0)');};
const shot=async name=>{await run('document.fonts.ready');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(`test-results/${name}.png`,Buffer.from(r.data,'base64'));};
const start=async(id,diagnostic=false)=>{await click('[data-view="practice"]');await change('#practice-concept',id);await click('[data-action="start-picked"]');};
const answer=async(correct=true)=>{
 const option=await run(`(()=>{const input=document.querySelector('input[name=answer]');const q=CALCULUS_DATA.questions.find(q=>q.options.some(o=>o.id===input.value));return ${correct?'q.correctOptionId':'q.options.find(o=>o.id!==q.correctOptionId).id'};})()`);
 await click(`input[value="${option}"]`);await click('#check-answer');await click('[data-action="next"]');
};
const rate=async(ease,progress,feelings)=>{await click(`[name="ease"][value="${ease}"]`);await click(`[name="progress"][value="${progress}"]`);for(const feeling of feelings)await click(`[name="feelings"][value="${feeling}"]`);};
const downloadBackup=async()=>{
 await click('[data-view="settings"]');
 await run('window.qaBlobs=[];URL.createObjectURL=b=>{qaBlobs.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){}');
 await click('[data-action="backup"]');return JSON.parse(await run('qaBlobs[0].text()'));
};
const importData=async(data,name='survey-backup')=>{
 const file=resolve(`test-results/${name}.json`);await writeFile(file,JSON.stringify(data));
 const root=await send('DOM.getDocument'),{nodeId}=await send('DOM.querySelector',{nodeId:root.root.nodeId,selector:'#import-file'});await send('DOM.setFileInputFiles',{nodeId,files:[file]});
};
try{
 await mkdir('test-results',{recursive:true});await send('Page.enable');await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDocument=crypto.randomUUID();window.qaCameraRequests=0;navigator.mediaDevices.getUserMedia=async()=>{qaCameraRequests++;throw new DOMException('QA denied','NotAllowedError')};`});
 await size(1440);await load('Page.navigate',{url:appURL});await click('[data-course="ALG1"]');
 await start('MATH_034');for(let i=0;i<9;i++)await answer(i<8);
 assert.equal(await run('!!document.querySelector("#progress-check-form")'),false);assert.equal((await stored()).progressChecks.length,0);
 await answer(false);await waitFor('!!document.querySelector("#progress-check-form")');
 assert.equal(await run('document.activeElement.id'),'progress-check-title');
 assert.equal(await run('!!document.querySelector("#question-timer, #camera-preview-host")'),false);
 assert.equal(await run('document.querySelectorAll("#progress-check-form input:checked").length'),0);
 assert.equal((await stored()).progressChecks.length,1);assert.equal((await stored()).progressChecks[0].attemptIds.length,10);
 await click('#progress-check-form [type="submit"]');assert.equal((await stored()).progressChecks[0].status,'pending');
 await rate(2,4,[]);await click('#progress-check-form [type="submit"]');assert.equal(await run('document.querySelector("#progress-check-error").hidden'),false);
 await click('[name="feelings"][value="confused"]');await click('[name="feelings"][value="frustrated"]');
 await click('.reflection-note summary');await change('#progress-check-note','Factoring helped. I still need to check negative signs.','input');
 await shot('progress-check-desktop');
 await size(390);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await shot('progress-check-mobile');
 await size(320);assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.equal(await run('[...document.querySelectorAll(".reflection-scale label,.reflection-feelings label")].every(e=>e.getBoundingClientRect().height>=44)'),true);
 await shot('progress-check-small-mobile');await size(1440);
 const answersBefore=(await stored()).attempts;
 await click('#progress-check-form [type="submit"]');assert.equal(await run('!!document.querySelector(".practice-complete")'),true);
 assert.equal(await run('document.querySelector(".result-number").textContent.trim()'),'8 / 10');
 assert.equal((await stored()).progressChecks[0].status,'completed');assert.deepEqual((await stored()).attempts,answersBefore);
 await click('[data-view="graph"]');assert.equal(await run('document.querySelector(\'.graph-node[data-concept="MATH_034"]\').dataset.fillScore'),'80');
 await click('[data-view="progress"]');await click('.progress-check-history>summary');await click('.reflection-history-list>details>summary');
 assert.match(await run('document.querySelector(".reflection-response").textContent'),/2\/5.*Difficult.*4\/5.*Steady progress.*Confused, Frustrated/);
 console.log('PASS survey follows ten answers, ratings and multiple feelings save, accessible desktop/320px layouts, history, and unchanged 8/10 passing');

 await change('#course','ALG2');await start('MATH_078');for(let i=0;i<10;i++)await answer();
 assert.equal(await run('!!document.querySelector("#progress-check-form")'),true);
 await click('[data-action="skip-progress-check"]');assert.equal((await stored()).progressChecks[1].status,'skipped');assert.equal(await run('!!document.querySelector(".practice-complete")'),true);
 await click('[data-view="progress"]');await click('.progress-check-history>summary');await click('.reflection-history-list>details>summary');await click('[data-action="resume-progress-check"]');
 await rate(4,5,['confident','satisfied']);await click('#progress-check-form [type="submit"]');assert.equal((await stored()).progressChecks[1].status,'completed');

 await change('#course','AB');await start('1.11');for(let i=0;i<3;i++)await answer();
 await load();await click('.next-check [data-action="diagnostic"]');assert.match(await run('document.querySelector(".question-meta").textContent'),/OF 7/);
 for(let i=0;i<7;i++)await answer();assert.equal(await run('!!document.querySelector("#progress-check-form")'),true);
 await rate(3,3,['curious']);await click('.reflection-note summary');await change('#progress-check-note','<em>More practice with limits</em>','input');
 await click('[data-view="graph"]');await click('[data-view="practice"]');assert.equal(await run('document.querySelector("#progress-check-note").value'),'<em>More practice with limits</em>');
 await load();await click('[data-view="practice"]');assert.equal(await run('document.querySelector("[name=ease]:checked").value'),'3');
 assert.equal(await run('document.querySelector("#progress-check-note").value'),'<em>More practice with limits</em>');
 await click('#progress-check-form [type="submit"]');assert.equal((await stored()).progressChecks.length,3);
 await click('.progress-check-history>summary');assert.equal(await run('document.querySelectorAll(".reflection-history-list>details").length'),1);
 assert.equal(await run('!!document.querySelector(".reflection-saved-note em")'),false);
 console.log('PASS separate Algebra II, AB and BC course histories, skip/finish-later, resumed diagnostic completion, persistent drafts, reload, and escaped notes');

 await change('#course','BC');await start('10.1');for(let i=0;i<10;i++)await answer();
 const requests=await run('qaCameraRequests');await new Promise(r=>setTimeout(r,300));assert.equal(await run('qaCameraRequests'),requests);
 await run('window.qaSave=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException("QA blocked","QuotaExceededError")}');
 await rate(1,2,['worried','discouraged']);await click('#progress-check-form [type="submit"]');assert.equal(await run('!!document.querySelector(".storage-warning")'),true);
 const backup=await downloadBackup();assert.equal(backup.progressChecks.length,4);assert.equal(backup.progressChecks[3].status,'completed');
 await run('Storage.prototype.setItem=window.qaSave');
 await click('[data-action="export-progress-checks"]');const output=await run('qaBlobs.at(-1).text()');assert.ok(output.includes('"Very difficult"'));assert.ok(output.includes('"Worried; Discouraged"'));assert.ok(!output.includes('MATH_034'));
 await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');assert.equal(await stored(),null);
 await importData(backup);await waitFor('document.querySelector("#toast").textContent.includes("Imported 40")');
 assert.deepEqual((await stored()).progressChecks,backup.progressChecks);
 await importData(backup,'duplicate-survey-backup');await waitFor('document.querySelector("#toast").textContent.includes("Imported 0")');assert.equal((await stored()).progressChecks.length,4);
 const invalid=structuredClone(backup);invalid.progressChecks[0].ease=6;const before=await stored();
 await importData(invalid,'invalid-survey-backup');await waitFor('document.querySelector("#toast").textContent.includes("Backup not imported")');assert.deepEqual(await stored(),before);
 await load();await click('[data-view="progress"]');assert.equal(await run('!!document.querySelector(".progress-check-history")'),true);
 console.log('PASS session-only storage warning and backup recovery, course-scoped CSV, complete backup round-trip, duplicate merge, invalid-import atomicity, and reload');

 await start('10.1');for(let i=0;i<10;i++)await answer();
 assert.equal((await stored()).progressChecks.length,5);const ids=(await stored()).progressChecks.map(c=>c.id);assert.equal(new Set(ids).size,5);
 await rate(5,5,['focused']);
 const {targetId}=await send('Target.createTarget',{url:appURL}),{sessionId:other}=await send('Target.attachToTarget',{targetId,flatten:true});
 for(let i=0;i<100;i++){if(await run('!!document.querySelector(".explore-home")',other))break;await new Promise(r=>setTimeout(r,100));}
 await run('document.querySelector("[data-view=settings]").click();document.querySelector("[data-action=delete-data]").click();document.querySelector("[data-action=confirm-delete]").click()',other);
 await waitFor('!document.querySelector("#progress-check-form")');assert.equal(await stored(),null);
 await click('[data-view="progress"]');assert.equal(await run('!!document.querySelector(".progress-check-history")'),false);
 await send('Target.closeTarget',{targetId});
 assert.deepEqual(errors,[]);console.log('PASS a fresh survey for a retry, cross-tab deletion clears in-progress drafts and history, and no browser runtime errors');
}finally{ws.close();}
