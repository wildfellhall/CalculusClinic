// Run in an isolated Chrome profile on port 9224 with fake media devices only.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {questions} from '../data/catalog.mjs';
import {skipProgressCheck,finishOnboardingWithoutCamera} from './browser-course-setup.mjs';
import {PDFDocument} from 'pdf-lib';
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
const node=id=>run(`(()=>{const e=document.querySelector('.graph-node[data-concept="${id}"]');return {score:e?.dataset.fillScore,status:e?.dataset.status}})()`);
const answerNext=async correct=>{
 const option=await run(`(()=>{const input=document.querySelector('input[name=answer]');const q=CALCULUS_DATA.questions.find(q=>q.options.some(o=>o.id===input.value));return ${correct?'q.correctOptionId':'q.options.find(o=>o.id!==q.correctOptionId).id'};})()`);
 await click(`input[value="${option}"]`);await click('#check-answer');await waitFor('!!document.querySelector(".answer-feedback")');await click('[data-action="next"]');
};
try{
 await mkdir('test-results/pdfs',{recursive:true});await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,screenWidth:1440,screenHeight:1080,deviceScaleFactor:1,mobile:false});
 await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDocument=crypto.randomUUID();navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('QA camera denied','NotAllowedError')};`});
 await load('Page.navigate',{url:appURL+'/'});await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 assert.equal(await run('document.querySelectorAll("[data-action=choose-course]").length'),5);
 assert.match(await run('document.querySelector("[data-course=CALC_SUBSET]").textContent'),/Calculus subset.*Algebra I.*Algebra II.*15 concepts/s);
 await snap('subset-onboarding');await click('[data-course="CALC_SUBSET"]');await finishOnboardingWithoutCamera(run,waitFor);
 assert.equal(await choice(),'CALC_SUBSET');assert.match(await run('document.querySelector("h1").textContent'),/Calculus subset/);
 await click('[data-view="graph"]');assert.equal(await run('document.querySelector("#graph-concept").value'),'1.6');
 const bridge=(source,target)=>run(`!!document.querySelector('.edge[data-source="${source}"][data-target="${target}"]')`);
 for(const id of ['MATH_057','MATH_081','MATH_082'])assert.equal(await bridge(id,'1.6'),true);
 assert.match(await run('document.querySelector("#graph-container").textContent'),/Algebra I/);assert.match(await run('document.querySelector("#graph-container").textContent'),/Algebra II/);
 await snap('subset-target-graph');
 await change('#graph-concept','F02');for(const id of ['MATH_057','MATH_081','MATH_082'])assert.equal(await bridge(id,'F02'),true);
 await click('[data-action="notes"]');for(const id of ['MATH_057','MATH_082'])assert.equal(await run(`!!document.querySelector('.concept-notes [data-id="${id}"]')`),true);
 await click('[data-view="graph"]');await change('#graph-scope','all');assert.equal(await run('document.querySelectorAll(".graph-node").length'),15);
 assert.equal(await run('!!document.querySelector(".graph-node[data-concept=\\"10.1\\"]")'),false);
 await click('[data-view="practice"]');assert.equal(await run('document.querySelector("#practice-concept").options.length'),15);assert.equal(await run('document.querySelector(".next-check").dataset.nextConcept'),'1.6');
 await click('[data-action="diagnostic"]');for(let i=0;i<10;i++)await answerNext(i<8);
 await waitFor('!!document.querySelector("#progress-check-title")');assert.equal(await run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1")).progressChecks.at(-1).course'),'CALC_SUBSET');
 await skipProgressCheck(run);await waitFor('!!document.querySelector(".practice-complete")');const history=await stored();assert.equal(history.length,10);assert.equal(history.filter(a=>a.correct).length,8);
 const next=await run('document.querySelector(".next-check").dataset.nextConcept');assert.ok(await run(`CALCULUS_DATA.concepts.find(c=>c.id===${JSON.stringify(next)}).subsets.includes('CALC_SUBSET')`));
 await click('[data-view="graph"]');await change('#graph-scope','all');assert.deepEqual(await node('1.6'),{score:'80',status:'passed'});
 await change('#course','AB');await change('#graph-scope','all');assert.equal(await run('document.querySelectorAll(".graph-node").length'),97);assert.deepEqual(await node('1.6'),{score:'80',status:'passed'});
 await change('#course','CALC_SUBSET');assert.equal(await run('document.querySelector("#graph-concept").value'),'1.6');assert.equal(await run('document.querySelector("#graph-scope").value'),'focus');
 // Reloading restores both the path and mastery, without another onboarding pass.
 await load();assert.equal(await choice(),'CALC_SUBSET');assert.deepEqual(await stored(),history);await click('[data-view="graph"]');assert.deepEqual(await node('1.6'),{score:'80',status:'passed'});
 await run('window.qaBlobs=[];window.qaNames=[];URL.createObjectURL=b=>{qaBlobs.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){qaNames.push(this.download)}');
 await click('[data-action="export-map"]');const svg=await run('await qaBlobs[0].text()');assert.ok(svg.includes('Algebra II'));assert.ok(svg.includes('data-source="MATH_057" data-target="1.6"'));
 await click('[data-action="export-report"]');await waitFor('qaBlobs.length===2');const bytes=await run('await qaBlobs[1].arrayBuffer().then(b=>Array.from(new Uint8Array(b)))');const pdf=await PDFDocument.load(new Uint8Array(bytes));assert.equal(pdf.getTitle(),'Calculus Clinic - Calculus subset report');assert.ok(pdf.getPageCount()>7);await writeFile('test-results/pdfs/calculus-subset-report.pdf',new Uint8Array(bytes));
 await click('[data-view="settings"]');const links=await run('[...document.querySelectorAll("a[download]")].map(a=>a.getAttribute("href"))');assert.equal(links.length,8);assert.ok(links.every(l=>l.startsWith('/data/calc_subset/')));
 for(const link of links)assert.ok((await fetch(appURL+link)).ok,link);
 const ontology=await (await fetch(appURL+'/data/calc_subset/ontology.json')).json();assert.equal(ontology.concepts.length,15);assert.equal(ontology.questions.length,150);assert.equal(ontology.metadata.targetId,'1.6');
 const target=ontology.concepts.find(c=>c.id==='1.6');assert.ok(target.prerequisites.includes('MATH_057'));assert.ok(target.prerequisites.includes('MATH_082'));
 assert.ok(ontology.coverage.some(c=>c.id.startsWith('AP.')));assert.ok(ontology.coverage.some(c=>c.course==='ALG1'));assert.ok(ontology.coverage.some(c=>c.course==='ALG2'));
 await click('[data-action="export-progress"]');const csv=await run('await qaBlobs[2].text()');assert.ok(csv.includes('Algebraic limit techniques'));assert.ok(!csv.includes('Integration by parts'));
 await click('[data-view="graph"]');await change('#graph-concept','1.6');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,screenWidth:390,screenHeight:844,deviceScaleFactor:1,mobile:true});await waitFor('innerWidth===390');assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);assert.equal(await bridge('MATH_082','1.6'),true);await snap('subset-mobile-graph');
 // An earlier, larger subset may have saved surveys for nodes now excluded.
 // Those records must load and remain in backups without reopening old checks.
 const earlier=questions.filter(q=>q.conceptId==='MATH_034').map((q,i)=>({id:'earlier-'+i,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:i<8?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct:i<8,answeredAt:new Date(Date.UTC(2026,9,15,12,i)).toISOString(),sessionId:'earlier-subset',durationMs:50000}));
 const earlierCheck={id:'earlier-subset',conceptId:'MATH_034',course:'CALC_SUBSET',completedAt:earlier.at(-1).answeredAt,attemptIds:earlier.map(a=>a.id),status:'pending',ease:null,progress:null,feelings:[],note:'',submittedAt:null};
 await run(`(()=>{const data=JSON.parse(localStorage.getItem('calculus-clinic-progress-v1'));data.attempts.push(...${JSON.stringify(earlier)});data.progressChecks.push(${JSON.stringify(earlierCheck)});localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify(data));})()`);
 await load();assert.equal(await run('!!document.querySelector(".storage-warning")'),false);assert.equal((await stored()).length,20);
 await click('[data-view="practice"]');assert.equal(await run('!!document.querySelector("#progress-check-title")'),false);assert.equal(await run('document.querySelector("#practice-concept").options.length'),15);
 await click('[data-view="progress"]');assert.equal(await run('!!document.querySelector("[data-progress-check=earlier-subset]")'),false);
 await click('[data-view="settings"]');await run('window.qaBlobs=[];URL.createObjectURL=b=>{qaBlobs.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){}');
 await click('[data-action="backup"]');const backup=await run('JSON.parse(await qaBlobs[0].text())');assert.equal(backup.attempts.length,20);assert.deepEqual(backup.progressChecks.find(c=>c.id==='earlier-subset'),earlierCheck);
 await click('[data-action="export-progress-checks"]');assert.equal((await run('await qaBlobs[1].text()')).includes('earlier-subset'),false);
 await change('#course','ALG1');await click('[data-view="graph"]');await change('#graph-scope','all');assert.deepEqual(await node('MATH_034'),{score:'80',status:'passed'});
 await change('#course','CALC_SUBSET');await change('#graph-scope','all');assert.equal(await run('document.querySelectorAll(".graph-node").length'),15);assert.equal(await run('!!document.querySelector(".graph-node[data-concept=MATH_034]")'),false);
 // Check that the experimental path card itself remains usable on a narrow first visit.
 await send('Storage.clearDataForOrigin',{origin:appURL,storageTypes:'local_storage'});await load();assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await click('[data-course="CALC_SUBSET"]');assert.equal(await choice(),'CALC_SUBSET');
 assert.deepEqual(errors,[]);console.log('PASS 15-concept Calculus subset: onboarding, cross-course graph/notes, diagnostic, survey, mastery persistence, scoped exports/PDF, mobile, and history from the larger subset.');
}finally{ws.close();}
